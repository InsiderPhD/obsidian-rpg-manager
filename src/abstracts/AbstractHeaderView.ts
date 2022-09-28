import {AbstractSubModelView} from "./AbstractSubModelView";
import {HeaderResponseInterface} from "../interfaces/response/subModels/HeaderResponseInterface";
import {FrontmatterElementSelectionModal} from "../modals/FrontmatterElementSelectionModal";
import {EditorSelector} from "../helpers/EditorSelector";
import {ComponentInterface} from "../interfaces/database/ComponentInterface";
import {HeaderResponseType} from "../enums/HeaderResponseType";
import {HeaderResponseElementInterface} from "../interfaces/response/subModels/HeaderResponseElementInterface";

export abstract class AbstractHeaderView extends AbstractSubModelView {
	protected currentElement: ComponentInterface;

	protected headerTitleEl: HTMLDivElement;
	protected headerInfoEl: HTMLDivElement;
	protected headerContainerEl: HTMLDivElement;

	private sessionSelectorEl: HTMLSelectElement;

	private isInternalRender = false;

	public internalRender(
		container: HTMLElement,
		data: HeaderResponseInterface,
	): void {
		this.isInternalRender = true;
		this.executeRender(container, data);
	}

	public render(
		container: HTMLElement,
		data: HeaderResponseInterface,
	): void {
		this.executeRender(container, data);
	}

	private executeRender(
		container: HTMLElement,
		data: HeaderResponseInterface,
	): void {
		this.currentElement = data.currentElement;

		//Init
		const crs = container.createDiv({cls: 'rpgm-header-info'});
		const adderEl = crs.createDiv({cls: 'adder'});
		this.headerTitleEl = crs.createDiv({cls: 'title'});

		//title
		data.link.fillContent(this.headerTitleEl, this.sourcePath);

		//relationship button
		const relationshipsAdderEl = adderEl.createEl('span', {text: '+ add relationship'});
		relationshipsAdderEl.addEventListener("click", () => {
			new FrontmatterElementSelectionModal(this.app, data.currentElement).open();
		});

		//edit button
		const c = adderEl.createEl('span', {text: 'edit'});

		c.addEventListener("click",() => {
			EditorSelector.select(this.app, data.currentElement);
		});

		//container
		this.headerContainerEl = crs.createDiv({cls: 'container'});
		this.headerInfoEl = this.headerContainerEl.createDiv({cls: 'info'});

		//image
		const crsImage = this.headerContainerEl.createDiv({cls: 'image'});
		if (data.imgSrc == null) {
			crsImage.addClass('invisible');
			this.headerInfoEl.addClass('info-large');
		} else {
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

		if (!this.isInternalRender){
			data.elements.forEach((element: HeaderResponseElementInterface) => {
				const containerEl = this.createContainerEl(element.type, element.title);
				element.value.fillContent(containerEl, this.sourcePath);
			});
		}

		this.headerContainerEl.createDiv({cls: 'reset'});
	}

	protected createContainerEl(
		responseType: HeaderResponseType,
		title: string,
	): HTMLDivElement {
		let prefix = 'short';
		let crsContainer: HTMLDivElement;

		if (responseType === HeaderResponseType.Long) {
			prefix = 'long';
			crsContainer = this.headerInfoEl;
		} else {
			crsContainer = this.headerInfoEl.createDiv({cls: 'short'});
		}

		crsContainer.createDiv({cls: prefix+ 'Title', text: title});
		crsContainer.createDiv({cls: prefix+ 'Text'});

		return crsContainer;
	}

	protected addElement(
		containerEl: HTMLDivElement,
		element: HeaderResponseElementInterface,
		fn: any,
	): void {
		switch (element.type){
			case HeaderResponseType.Long:
			case HeaderResponseType.Short:
				element.value.fillContent(containerEl.children[1] as HTMLDivElement, this.sourcePath);
				break;
			default:
				fn;
		}

		if (element.type !== HeaderResponseType.Long){
			containerEl.createDiv({cls: 'reset'});
		}
	}
}