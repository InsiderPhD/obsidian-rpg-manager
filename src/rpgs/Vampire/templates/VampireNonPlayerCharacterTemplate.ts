import {NonPlayerCharacterTemplateFactory} from "../../../templates/frontmatter/NonPlayerCharacterTemplateFactory";

export class VampireNonPlayerCharacterTemplate extends NonPlayerCharacterTemplateFactory {
	public addFrontmatterData(
		frontmatter: any,
	): void {
	}

	public generateInitialCodeBlock(
	): string|undefined {
		return undefined;
	}

	public generateLastCodeBlock(
	): string|undefined {
		return undefined;
	}
}
