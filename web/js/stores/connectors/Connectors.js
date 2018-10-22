import ConnectorStore from '../../stores/ConnectorStore';
import GitHubStore from '../../stores/GitHubStore';
import BitbucketStore from '../../stores/BitbucketStore';
import BitbucketServerStore from '../../stores/BitbucketServerStore';
import JenkinsStore from '../../stores/JenkinsStore';
import SaltStore from '../../stores/SaltStore';
/*
* Maps connector types, to their action types.
*/


// for code
// ConnectorStore.register(<connector_type>, <associated_store>, [
//     {id: 'branches', label: 'Branches'}
// ]);


ConnectorStore.register('github', GitHubStore, [
    {id: 'branches', label: 'Branches'}
]);

ConnectorStore.register('bitbucket', BitbucketStore, [
    {id: 'branches', label: 'Branches'}
]);

ConnectorStore.register('bitbucketserver', BitbucketServerStore, [
    {id: 'branches', label: 'Branches'}
]);


// job managers
ConnectorStore.register('jenkins', JenkinsStore, [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
    {id: 'generic', label: 'Generic Method'}
]);

ConnectorStore.register('salt', SaltStore, [
    {id: 'command', label: 'Command runner'}
]);

export default ConnectorStore;
