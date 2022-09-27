import {AbstractSubModelView} from "../../abstracts/AbstractSubModelView";
import {HeaderResponseInterface} from "../../interfaces/response/subModels/HeaderResponseInterface";
import {HeaderResponseElementInterface} from "../../interfaces/response/subModels/HeaderResponseElementInterface";
import {HeaderResponseType} from "../../enums/HeaderResponseType";
import {SessionInterface} from "../../interfaces/components/SessionInterface";
import {ComponentType} from "../../enums/ComponentType";
import {IdInterface} from "../../interfaces/components/IdInterface";
import {Component, MarkdownRenderer, TFile} from "obsidian";
import {SceneSelectionModal} from "../../modals/SceneSelectionModal";
import {SorterComparisonElement} from "../../database/SorterComparisonElement";
import {StoryCircleStage} from "../../enums/StoryCircleStage";
import {ViewType} from "../../enums/ViewType";
import {FrontmatterElementSelectionModal} from "../../modals/FrontmatterElementSelectionModal";
import {EditorSelector} from "../../helpers/EditorSelector";
import {SorterType} from "../../enums/SorterType";
import {AbtStage} from "../../enums/AbtStage";

export class HeaderView extends AbstractSubModelView {
	private sessionSelectorEl: HTMLSelectElement;
	private storyCircleSelectorEl: HTMLSelectElement;
	private abtSelectorEl: HTMLSelectElement;

	render(
		container: HTMLElement,
		data: HeaderResponseInterface,
	): void {
		const crs = container.createDiv({cls: 'rpgm-header-info'});
		const adderEl = crs.createDiv({cls: 'adder'});
		const crsTitle = crs.createDiv({cls: 'title'});

		data.link.fillContent(crsTitle, this.sourcePath);


		const relationshipsAdderEl = adderEl.createEl('span', {text: '+ add relationship'});
		relationshipsAdderEl.addEventListener("click", () => {
			new FrontmatterElementSelectionModal(this.app, data.currentElement).open();
		});
		const c = adderEl.createEl('span', {text: 'edit'});

		c.addEventListener("click",() => {
			EditorSelector.select(this.app, data.currentElement);
		});

		if (data.type === ComponentType.Campaign) {
			crsTitle.createEl('a', {cls: 'subtitle', text: 'View Campaign Timeline', href: '#'})
				.addEventListener("click", () => {
					this.factories.views.showObsidianView(ViewType.Timeline, [data.metadata.campaignId]);
				});
		}

		const crsContainer = crs.createDiv({cls: 'container'});

		const crsInfo = crsContainer.createDiv({cls: 'info'});
		const crsImage = crsContainer.createDiv({cls: 'image'});
		if (data.imgSrc == null) {
			crsImage.addClass('invisible');
			crsInfo.addClass('info-large');
		}

		data.elements.forEach((element: HeaderResponseElementInterface) => {
			let prefix = 'short';
			let crsContainer: HTMLElement;

			if (element.type === HeaderResponseType.Long) {
				prefix = 'long';
				crsContainer = crsInfo;
			} else {
				crsContainer = crsInfo.createDiv({cls: 'short'});
			}

			crsContainer.createDiv({cls: prefix+ 'Title', text: element.title});
			const contentEl = crsContainer.createDiv({cls: prefix+ 'Text'});

			if (element.type === HeaderResponseType.ScenesSelection){
				this.addScenesSelection(contentEl, element);
			} else if (element.type === HeaderResponseType.SessionSelection) {
				this.addSessionSelector(contentEl, element);
			} else if (element.type === HeaderResponseType.StoryCircleSelector) {
				this.addStoryCircleStageSelector(contentEl, element);
			} else if (element.type === HeaderResponseType.AbtSelector) {
				this.addAbtStageSelector(contentEl, element);
			} else {
				element.value.fillContent(contentEl, this.sourcePath);
			}

			if (element.type !== HeaderResponseType.Long){
				crsContainer.createDiv({cls: 'reset'});
			}
		});


		if (data.imgSrc != null) {
			const image = new Image(data.imgWidth, data.imgHeight);
			image.src = data.imgSrc;
			image.style.objectFit = 'cover';

			if (image.src.startsWith('http')) {
				const crsImageLink = crsImage.createEl('a', {href: image.src});
				crsImageLink.append(image);
			} else {
				crsImage.append(image);
			}

		}

		crsContainer.createDiv({cls: 'reset'});
	}

	private addStoryCircleStageSelector(
		contentEl: HTMLDivElement,
		data: HeaderResponseElementInterface,
	): void {
		const sceneId:IdInterface|undefined = data.additionalInformation?.sceneId;
		
		if (sceneId !== undefined) {

			this.storyCircleSelectorEl = contentEl.createEl("select");
			this.storyCircleSelectorEl.createEl("option", {
				text: "",
				value: ""
			}).selected = true;

			Object.keys(StoryCircleStage).filter((v) => isNaN(Number(v))).forEach((type, index) => {
				const storyCircleOptionEl = this.storyCircleSelectorEl.createEl("option", {
					text: type,
					value: type,
				});

				if (data.value.content.toString() === type) storyCircleOptionEl.selected = true;
			});

			this.storyCircleSelectorEl.addEventListener("change", (e) => {
				const file: TFile|undefined = data.additionalInformation.file;

				if (file !== undefined){
					const map: Map<string,string> = new Map<string, string>();
					map.set('storycircle', this.storyCircleSelectorEl.value);
					this.factories.frontmatter.update(file, map);
				}
			});
		}
	}

	private addAbtStageSelector(
		contentEl: HTMLDivElement,
		data: HeaderResponseElementInterface,
	): void {
		if (data.additionalInformation?.id !== undefined) {

			this.abtSelectorEl = contentEl.createEl("select");
			this.abtSelectorEl.createEl("option", {
				text: "",
				value: ""
			}).selected = true;

			Object.keys(AbtStage).filter((v) => isNaN(Number(v))).forEach((type, index) => {
				const abtOptionEl = this.abtSelectorEl.createEl("option", {
					text: type,
					value: type,
				});

				if (data.value.content.toString() === type) abtOptionEl.selected = true;
			});

			this.abtSelectorEl.addEventListener("change", (e) => {
				const file: TFile|undefined = data.additionalInformation.file;

				if (file !== undefined){
					const map: Map<string,string> = new Map<string, string>();
					map.set('abt', this.abtSelectorEl.value);
					this.factories.frontmatter.update(file, map);
				}
			});

			if (data.value.content.toString() !== ''){
				if (data.additionalInformation.id.type === ComponentType.Act) {
					this.calculateActBalance(data.additionalInformation.id, data.value.content);
				} else {
					this.calculateSessionBalance(data.additionalInformation.id, data.value.content);
				}
			}
		}
	}

	private calculateActBalance(
		actId: IdInterface,
		stage: AbtStage,
	): void {

	}

	private calculateSessionBalance(
		sessionId: IdInterface,
		stage: AbtStage,
	): void {

	}

	private addSessionSelector(
		contentEl: HTMLDivElement,
		data: HeaderResponseElementInterface,
	): void {
		const sceneId:IdInterface|undefined = data.additionalInformation?.sceneId;

		if (sceneId !== undefined) {
			const sessions: Array<SessionInterface> = this.database.read<SessionInterface>((session: SessionInterface) => session.id.type === ComponentType.Session && session.id.campaignId === sceneId.campaignId)
					.sort(this.factories.sorter.create<SessionInterface>([
						new SorterComparisonElement((session: SessionInterface) => session.sessionId, SorterType.Descending)
					]));

			sessions.forEach((session: SessionInterface) => {
				if (data.value.content.toString() === session.sessionId.toString()) {
					const sessionLinkEl = contentEl.createEl('span');
					MarkdownRenderer.renderMarkdown(
						session.link,
						sessionLinkEl,
						'',
						null as unknown as Component,
					);
				}
			});

			this.sessionSelectorEl = contentEl.createEl("select");
			if (sessions.length > 1) {
				this.sessionSelectorEl.createEl("option", {
					text: "",
					value: ""
				}).selected = true;
			}
			sessions.forEach((session: SessionInterface) => {
				const sessionOptionEl = this.sessionSelectorEl.createEl("option", {
					text: session.name,
					value: session.sessionId.toString(),
				});

				if (data.value.content.toString() === session.sessionId.toString()) sessionOptionEl.selected = true;
			});

			this.sessionSelectorEl.addEventListener("change", (e) => {
				this.selectSession(data);
			});
		}
	}

	private addScenesSelection(
		contentEl: HTMLDivElement,
		data: HeaderResponseElementInterface,
	): void {
		const sceneSelectionButtonEl = contentEl.createEl('button', {text: 'Select session scenes'});
		sceneSelectionButtonEl.addEventListener("click", () => {
			new SceneSelectionModal(this.app, data.additionalInformation.session).open();
		});
	}

	private async selectSession(
		data: HeaderResponseElementInterface,
	): Promise<void> {
		const file: TFile|undefined = data.additionalInformation.file;

		if (file !== undefined){
			const map: Map<string,string> = new Map<string, string>();
			map.set('session', this.sessionSelectorEl.value);
			this.factories.frontmatter.update(file, map);
		}
	}
}