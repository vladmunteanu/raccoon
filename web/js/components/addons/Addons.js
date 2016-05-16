import AddonStore from '../../stores/AddonStore';
import DummyAddon from './DummyAddon.react';
import GitBranchesAddon from './GitBranchesAddon.react';
import SelectBuildAddon from './SelectBuildAddon.react';


AddonStore.register('DummyAddon', DummyAddon);
AddonStore.register('GitBranchesAddon', GitBranchesAddon);
AddonStore.register('SelectBuildAddon', SelectBuildAddon);

export default AddonStore;
