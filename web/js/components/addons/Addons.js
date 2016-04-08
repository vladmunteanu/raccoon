import AddonStore from '../../stores/AddonStore';
import DummyAddon from './DummyAddon.react';
import GitBranchesAddon from './GitBranchesAddon.react';


AddonStore.register('DummyAddon', DummyAddon);
AddonStore.register('GitBranchesAddon', GitBranchesAddon);

export default AddonStore;
