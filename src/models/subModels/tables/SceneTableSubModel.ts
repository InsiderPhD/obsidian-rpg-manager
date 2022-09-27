import {ContentType} from "../../../enums/ContentType";
import {SceneInterface} from "../../../interfaces/components/SceneInterface";
import {RelationshipInterface} from "../../../interfaces/RelationshipInterface";
import {AbstractTableSubModel} from "../../../abstracts/AbstractTableSubModel";
import {RpgManagerAdvancedSettingsListsInterface} from "../../../settings/RpgManagerSettingsInterface";
import {ComponentInterface} from "../../../interfaces/database/ComponentInterface";
import {ContentInterface} from "../../../interfaces/ContentInterface";
import {TableField} from "../../../enums/TableField";

export class SceneTableSubModel extends AbstractTableSubModel {
	protected advancedSettings: RpgManagerAdvancedSettingsListsInterface = this.settings.advanced.Agnostic.SceneList;

	protected generateHeaderElement(
		fieldType: TableField,
	): ContentInterface|undefined {
		switch (fieldType) {
			case TableField.StartTime:
				return this.factories.contents.create('Start', ContentType.String, true);
				break;
			case TableField.EndTime:
				return this.factories.contents.create('End', ContentType.String, true);
				break;
			case TableField.Duration:
				return this.factories.contents.create('Duration', ContentType.String);
				break;
			case TableField.StoryCircleIndicator:
				return this.factories.contents.create('', ContentType.String);
				break;
		}

		return super.generateHeaderElement(fieldType);
	}

	protected generateContentElement<T extends ComponentInterface>(
		index: number,
		fieldType: TableField,
		record: T,
		relationship: RelationshipInterface,
	): ContentInterface|undefined {
		const scene: SceneInterface = <unknown>record as SceneInterface;
		switch (fieldType) {
			case TableField.Index:
				return this.factories.contents.create(scene.completed ? index.toString() : '**' + index.toString() + '**', ContentType.Markdown, true);
				break;
			case TableField.Name:
				return this.factories.contents.create(scene.link + (scene.completed ? '' : ' _(incomplete)_'), ContentType.Link);
				break;
			case TableField.StartTime:
				return this.factories.contents.create(this.formatTime(scene.startTime), ContentType.Date, true);
				break;
			case TableField.Date:
				return this.factories.contents.create((scene.date != null ? scene.date.toDateString() : ''), ContentType.Date, true);
				break;
			case TableField.EndTime:
				return this.factories.contents.create(this.formatTime(scene.endTime), ContentType.Date, true);
				break;
			case TableField.Duration:
				return this.factories.contents.create(scene.duration, ContentType.Date, true);
				break;
			case TableField.StoryCircleIndicator:
				return this.factories.contents.create('pieEighth', ContentType.SVG, true, {storyCircleStage: scene.storycircleStage});
				break;
		}

		return super.generateContentElement(index, fieldType, record, relationship);
	}

	private formatTime(
		date: Date|null
	): string {
		if (date == null) return '';

		const hours = date.getHours();
		const minutes = date.getMinutes();

		return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
	}
}