import {RecordInterface} from "../../interfaces/database/RecordInterface";
import {App, CachedMetadata, TFile} from "obsidian";
import {DataType} from "../../enums/DataType";
import {CampaignInterface} from "../../interfaces/data/CampaignInterface";
import {DatabaseInterface} from "../../interfaces/database/DatabaseInterface";
import {RelationshipInterface} from "../../interfaces/RelationshipInterface";
import {BaseCampaignInterface} from "../../interfaces/data/BaseCampaignInterface";
import {Id} from "../../database/Id";
import {TagMisconfiguredError} from "../../errors/TagMisconfiguredError";
import {MultipleRpgManagerTagsError} from "../../errors/MultipleRpgManagerTagsError";

export abstract class AbstractRecord implements RecordInterface {
	public frontmatter: any;

	public basename: string;

	public tags: Array<string>;

	public completed: boolean;
	public synopsis: string|null = null;
	public additionalInformation: string|null = null;
	public imageSrc: string|null|undefined = undefined;
	public imageUrl: string|undefined=undefined;

	public isOutline: boolean;
	public campaign: BaseCampaignInterface;

	public relationships: Map<string, RelationshipInterface>;

	private metadata: CachedMetadata;

	constructor(
		protected app: App,
		public file: TFile,
		public id: Id,
	) {
	}

	public get name(
	): string {
		return this.file.basename;
	}

	public get path(
	): string {
		return this.file.path;
	}

	public get link(
	): string {
		return '[[' + this.name + ']]'
	}

	public get imageSrcElement(
	): HTMLElement|null {
		if (this.imageSrc === null) return null;

		return this.app.plugins.getPlugin('rpg-manager').functions.getImgElement(this.image);
	}

	public get folder(
	): string {
		const lastSlashPosition = this.path.lastIndexOf('/');
		return (lastSlashPosition !== -1 ? this.path.substring(0, lastSlashPosition + 1) : '/');
	}

	public get image(
	): string|null {
		const localImage = this.app.plugins.getPlugin('rpg-manager').functions.getImg(this.name);
		if (localImage !== null) return localImage;

		if (this.imageUrl !== undefined) return this.imageUrl;

		return null;
	}

	public async initialise(
	): Promise<void> {
		const metadata: CachedMetadata|null = this.app.metadataCache.getFileCache(this.file);
		if (metadata === null) throw new Error('metadata is null');

		this.metadata = metadata;
		this.frontmatter = this.metadata.frontmatter ?? {};
		this.basename = this.file.basename;

		this.tags = await this.app.plugins.getPlugin('rpg-manager').factories.tags.sanitiseTags(this.frontmatter?.tags);

		this.validateTag();

		this.completed = this.frontmatter.completed ? this.frontmatter.completed : true;
		this.synopsis = this.frontmatter.synopsis;
		this.imageUrl = this.frontmatter?.image;

		await this.initialiseRelationships();
		this.initialiseData();
	}

	protected validateTag(
	): void {
		let rpgManagerTagCounter = 0;
		(this.tags || []).forEach((tag: string) => {
			if (this.app.plugins.getPlugin('rpg-manager').factories.tags.isRpgManagerTag(tag)) rpgManagerTagCounter++;
		});
		if (rpgManagerTagCounter > 1) throw new MultipleRpgManagerTagsError(this.app, this.id);

		if (!this.id.isValid) throw new TagMisconfiguredError(this.app, this.id);
	}

	protected async initialiseRelationships(
	): Promise<void> {
		this.relationships = await new Map();
		await this.app.plugins.getPlugin('rpg-manager').factories.relationships.read(this.file, this.relationships);
	}

	protected initialiseData(
	): void {
	}

	public async reload(
	): Promise<void> {
		await this.validateTag();
		await this.initialise();
		await this.initialiseData();
	}

	public async loadHierarchy(
		database: DatabaseInterface,
	): Promise<void> {
		if (this.id.type !== DataType.Campaign) this.campaign = await database.readSingle<CampaignInterface>(DataType.Campaign, this.id.tag);
	}

	public async loadRelationships(
		database: DatabaseInterface,
	): Promise<void> {
		this.relationships.forEach((relationship: RelationshipInterface, name: string) => {
			const dataList = database.read(
				(data: RecordInterface) => data.name === name,
			);

			switch (dataList.length){
				case 0:
					relationship.component = undefined;
					break;
				case 1:
					relationship.component = dataList[0]
					break;
			}
		});
	}

	public async loadReverseRelationships(
	): Promise<void> {
		if (!this.isOutline) {
			this.relationships.forEach((relationship: RelationshipInterface, name: string) => {
				if (relationship.component !== undefined){
					relationship.component.addReverseRelationship(
						this.name,
						{
							component: this,
							description: relationship.description,
							isReverse: true,
						}
					)
				}
			});
		}
	}

	public addReverseRelationship(
		name: string,
		relationship: RelationshipInterface,
	): void {
		this.relationships.set(name, relationship);
	}

	public getRelationships(
		type: DataType,
		requiresReversedRelationship = false,
	): Array<RelationshipInterface> {
		const response:Array<RelationshipInterface> = [];

		this.relationships.forEach((relationship: RelationshipInterface, name: string) => {
			if (relationship.component !== undefined && (type & relationship.component.id.type) == relationship.component.id.type) {
				if (!requiresReversedRelationship || (requiresReversedRelationship && relationship.isReverse)) response.push(relationship);
			}
		});

		return response;
	}

	protected initialiseDate(
		date: string|null,
	): Date|null {
		if (date == null) return null;

		const response = new Date(date);
		return response;
	}
}
