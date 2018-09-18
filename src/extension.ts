import * as sourcegraph from 'sourcegraph'

export function activate(): void {
    console.log('Hello, world!')
    sourcegraph.app.registerViewProvider('projectView.workspaceView', {
        html: '<style>body { color: white; }</style><h1>Hello, world! from a repository view</h1>',
    })
}
