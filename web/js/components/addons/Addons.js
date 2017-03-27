import AddonStore from '../../stores/AddonStore';
import DummyAddon from './DummyAddon.react';
import GitBranchesAddon from './GitBranchesAddon.react';
import BitbucketBranchesAddon from './BitbucketBranchesAddon.react';
import SelectBuildAddon from './SelectBuildAddon.react';
import EditConfigAddon from './EditConfigAddon.react';
import HealthCheckAddon from './HealthCheckAddon.react';
import E2ETestDesktopAddon from './E2ETestDesktopAddon.react';


AddonStore.register('DummyAddon', DummyAddon);
AddonStore.register('GitBranchesAddon', GitBranchesAddon);
AddonStore.register('BitbucketBranchesAddon', BitbucketBranchesAddon);
AddonStore.register('SelectBuildAddon', SelectBuildAddon);
AddonStore.register('EditConfig', EditConfigAddon);
AddonStore.register('HealthCheckAddon', HealthCheckAddon);
AddonStore.register('E2ETestDesktopAddon', E2ETestDesktopAddon);

export default AddonStore;
