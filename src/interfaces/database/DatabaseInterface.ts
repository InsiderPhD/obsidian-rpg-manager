import {RecordInterface} from "./RecordInterface";
import {DataType} from "../../enums/DataType";

export interface DatabaseInterface {
	elements: RecordInterface[];

	create(
		data: RecordInterface,
	): void;

	read(
		query?: any,
		comparison?: any,
	): Array<RecordInterface>;

	update(
		data: RecordInterface,
	): void;

	delete(
		data: RecordInterface|string,
	): boolean;

	readByPath<T extends RecordInterface>(
		name: string,
	): T|undefined;

	readSingleParametrised<T extends RecordInterface>(
		dataType: DataType,
		campaignId: number,
		adventureId?: number|undefined,
		sessionId?: number|undefined,
		sceneId?: number|undefined,
	): T;

	readSingle<T extends RecordInterface>(
		dataType: DataType,
		tag: string,
		overloadId?: number|undefined,
	): T;

	readListParametrised<T extends RecordInterface>(
		dataType: DataType,
		campaignId?: number|undefined,
		adventureId?: number|undefined,
		sessionId?: number|undefined,
		sceneId?: number|undefined,
		comparison?: any|undefined,
	): Array<T>;

	readList<T extends RecordInterface>(
		dataType: DataType,
		tag: string,
		comparison?: any|undefined,
		overloadId?: number|undefined,
	): Array<T>;
}
