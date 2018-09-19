import * as sourcegraph from 'sourcegraph'

export function activate(): void {
    const panelView = sourcegraph.app.createPanelView('projectView.panel')
    panelView.title = 'Project chart'
    panelView.content = 'Open a file to see a Gantt chart of projects.'

    sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
        const numWords = doc.text.split(/\b/).length
        panelView.content = `Word count: ${numWords} <svg width="400" height="180">        <rect x="50" y="20" width="150" height="150" style="fill:blue;stroke:pink;stroke-width:5;opacity:0.5" />      </svg>`
    })
}
