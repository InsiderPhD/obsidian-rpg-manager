import {AbstractTemplateFactory} from "../../../abstracts/AbstractTemplateFactory";
import {RpgCodeBlockInterface} from "../../../interfaces/RpgCodeBlockInterface";
import {RpgCodeBlock} from "../../../helpers/RpgCodeBlock";

export class SessionTemplateFactory extends AbstractTemplateFactory {
	public addFrontmatterData(
		frontmatter: any,
	): void {
		frontmatter.tags.push(this.app.plugins.getPlugin('rpg-manager').settings.sessionTag + '/' + this.campaignId + '/' + this.adventureId + '/' + this.sessionId);
		frontmatter.synopsis = "";
		frontmatter.dates = {
			session: "",
			irl: "",
		}
	}

	public generateInitialCodeBlock(
	): RpgCodeBlockInterface|undefined {
		return new RpgCodeBlock(
			'sessionNavigation',
			{
				abt: {
					need: "",
					and: "",
					but: "",
					therefore: "",
				},
				storycircle: {
					you: "",
					need: "",
					go: "",
					search: "",
					find: "",
					take: "",
					return: "",
					change: "",
				}
			}
		);
	}

	public generateLastCodeBlock(
	): RpgCodeBlockInterface|undefined {
		return new RpgCodeBlock(
			'session',
		);
	}
}