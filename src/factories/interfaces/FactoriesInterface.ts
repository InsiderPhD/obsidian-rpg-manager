import {SubModelFactoryInterface} from "../../models/factories/interfaces/SubModelFactoryInterface";
import {ContentFactoryInterface} from "../../responses/factories/interfaces/ContentFactoryInterface";
import {FileFactoryInterface} from "../../templates/factories/interfaces/FileFactoryInterface";
import {ModalFactoryInterface} from "../../modals/factories/interfaces/ModalFactoryInterface";
import {ModelFactoryInterface} from "../../models/factories/interfaces/ModelFactoryInterface";
import {PronounFactoryInterface} from "../../databases/factories/interfaces/PronounFactoryInterface";
import {TemplateFactoryInterface} from "../../templates/factories/interfaces/TemplateFactoryInterface";
import {ViewFactoryInterface} from "../../views/factories/interfaces/ViewFactoryInterface";
import {FetcherFactoryInterface} from "../../fetchers/factories/interfaces/FetcherFactoryInterface";
import {IdFactoryInterface} from "../../databases/factories/interfaces/IdFactoryInterface";
import {BreadcrumbFactoryInterface} from "../../views/factories/interfaces/BreadcrumbFactoryInterface";
import {SorterFactoryInterface} from "../../databases/factories/interfaces/SorterFactoryInterface";
import {RunningTimeManagerInterface} from "../../timers/interfaces/RunningTimeManagerInterface";
import {DatabaseFactoryInterface} from "../../databases/factories/interfaces/DatabaseFactoryInterface";
import {ComponentFactoryInterface} from "../../databases/factories/interfaces/ComponentFactoryInterface";
import {ComponentTypeFactoryInterface} from "../../databases/factories/interfaces/ComponentTypeFactoryInterface";
import {RelationshipTypeFactoryInterface} from "../../relationships/factories/interfaces/RelationshipTypeFactoryInterface";
import {SceneTypeFactoryInterface} from "../../databases/factories/interfaces/SceneTypeFactoryInterface";
import {StoryCircleStageFactoryInterface} from "../../plots/factories/interfaces/StoryCircleStageFactoryInterface";
import {AbtStageFactoryInterface} from "../../plots/factories/interfaces/AbtStageFactoryInterface";
import {RelationshipFactoryInterface} from "../../relationships/factories/interfaces/RelationshipFactoryInterface";

export interface FactoriesInterface {
	subModels: SubModelFactoryInterface;
	contents: ContentFactoryInterface;
	component: ComponentFactoryInterface;
	files: FileFactoryInterface;
	modals: ModalFactoryInterface;
	models: ModelFactoryInterface;
	pronouns: PronounFactoryInterface;
	templates: TemplateFactoryInterface;
	views: ViewFactoryInterface;
	fetchers: FetcherFactoryInterface;
	database: DatabaseFactoryInterface;
	id: IdFactoryInterface;
	breadcrumb: BreadcrumbFactoryInterface;
	sorter: SorterFactoryInterface;
	componentType: ComponentTypeFactoryInterface;
	relationshipType: RelationshipTypeFactoryInterface;
	sceneType: SceneTypeFactoryInterface;
	storyCircleStage: StoryCircleStageFactoryInterface;
	abtStage: AbtStageFactoryInterface;
	relationship: RelationshipFactoryInterface;

	runningTimeManager: RunningTimeManagerInterface;
}
