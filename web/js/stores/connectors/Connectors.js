import ConnectorStore from '../../stores/ConnectorStore';


// for code
ConnectorStore.register('github', [
    {id: 'branches', label: 'Branches'},
]);

ConnectorStore.register('bitbucket', [
    {id: 'branches', label: 'Branches'},
]);


// job managers
ConnectorStore.register('jenkins', [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
    {id: 'config', label: 'Config'},
]);

ConnectorStore.register('salt', [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
]);

export default ConnectorStore;
