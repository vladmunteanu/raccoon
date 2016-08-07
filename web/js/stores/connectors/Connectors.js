import ConnectorStore from '../../stores/ConnectorStore';
import GiHubStore from '../../stores/GitHubStore';
import BitbucketStore from '../../stores/BitbucketStore';
import JenkinsStore from '../../stores/JenkinsStore';
//import SaltStore from '../../stores/SaltStore';
/*
* Maps connector types, to their action types.
*/


// for code
ConnectorStore.register('github', GiHubStore, [
    {id: 'branches', label: 'Branches'}
]);

ConnectorStore.register('bitbucket', BitbucketStore, [
    {id: 'branches', label: 'Branches'}
]);


// job managers
ConnectorStore.register('jenkins', JenkinsStore, [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
    {id: 'config', label: 'Config'}
]);

ConnectorStore.register('salt', null, [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'}
]);

export default ConnectorStore;
