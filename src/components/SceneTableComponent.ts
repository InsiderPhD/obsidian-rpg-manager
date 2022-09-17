import {AbstractComponent} from "../abstracts/AbstractComponent";
import {ResponseElementInterface} from "../interfaces/response/ResponseElementInterface";
import {ResponseTable} from "../data/responses/ResponseTable";
import {ContentType} from "../enums/ContentType";
import {RecordInterface} from "../interfaces/database/RecordInterface";
import {SceneInterface} from "../interfaces/data/SceneInterface";
import {RelationshipInterface} from "../interfaces/RelationshipInterface";

export class SceneTableComponent extends AbstractComponent {
	public async generateData(
		relationships: RelationshipInterface[],
		title:string|undefined,
		additionalInformation: any|undefined,
	): Promise<ResponseElementInterface|null> {
		if (relationships.length === 0) return null;

		const response = new ResponseTable(this.app);

		response.addTitle(title ? title : 'Scenes');

		response.addHeaders([
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('#', ContentType.String, true),
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('Scene', ContentType.String),
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('Synopsis', ContentType.String),
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('Start', ContentType.String),
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('End', ContentType.String),
			this.app.plugins.getPlugin('rpg-manager').factories.contents.create('Duration', ContentType.String),
		]);
		relationships.forEach((relationship: RelationshipInterface) => {
			const scene: SceneInterface|undefined = relationship.component as SceneInterface;
			if (scene !== undefined) {
				response.addContent([
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(scene.completed ? scene.sceneId.toString() : '**' + scene.sceneId + '**', ContentType.Markdown, true),
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(scene.link, ContentType.Link),
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(scene.synopsis, ContentType.Markdown),
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(this.app.plugins.getPlugin('rpg-manager').functions.formatTime(scene.startTime), ContentType.String, true),
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(this.app.plugins.getPlugin('rpg-manager').functions.formatTime(scene.endTime), ContentType.String, true),
					this.app.plugins.getPlugin('rpg-manager').factories.contents.create(scene.duration, ContentType.String, true),
				])
			}
		});
		return response;
	}
}
