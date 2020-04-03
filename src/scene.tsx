import React, {MouseEventHandler} from 'react';
import {Model, ModelCell, ModelColumn} from "./model";
import imageAI from './resources/AI.svg'
import imageHuman from './resources/human.svg'
import {aiPlay} from "./ai";

function humanPlay(changeStatus: (change: any) => void, model: Model, x: number, level: number) {
    changeStatus({message: ''})
    if (!model.available(x)) {
        changeStatus({message: '不能放在这里'})
        return
    }
    const onTop=!model.put(x, ModelCell.Human)
    if (model.win(ModelCell.Human)) {
        changeStatus({message: '你赢了😀', stop: true})
        return
    }
    if(onTop){
        changeStatus({message: '不能放在这里'})
        return
    }
    if (model.full()) {
        changeStatus({message: '平局😝', stop: true})
        return
    }
    if (aiPlay(model, level)) {
        if (model.win(ModelCell.AI)) {
            changeStatus({message: '你输了😝', stop: true})
            return
        }
    }
    if (model.full()) {
        changeStatus({message: '平局😝', stop: true})
        return
    }
}

export class Cell extends React.Component<{ cell: ModelCell }, any> {
    render(): any {
        switch (this.props.cell) {
            case ModelCell.AI:
                return <img src={imageAI} className={'cell'}/>
            case ModelCell.Human:
                return <img src={imageHuman} className={'cell'}/>
        }
        alert('error')
    }
}

export class Column extends React.Component<{ column: ModelColumn, onClick: any }, any> {
    render(): any {
        const column = this.props.column
        const cells = column.cells
        const images = cells.map((cell) => <Cell cell={cell}/>)
        return <div className={'column'} onClick={this.props.onClick}>{images}</div>
    }
}

// function Column(column:ModelColumn,onClick:MouseEvent=>void:any{
//     const cells=column.cells
//     const images=cells.map((cell)=><Cell cell={cell}/>)
//     return <span className={'column'} onClick={onclick}>{images}</span>
// }

export class Scene extends React.Component<{ model: Model, changeStatus: (change: any) => void, level: number, stop: boolean }, any> {
    render(): any {
        const model = this.props.model
        const modelColumns = model.columns
        let columns = []//modelColumns.map((column)=><Column column={column} onClick={}/>)
        for (let x = 0; x < modelColumns.length; x++) {
            const modelColumn = modelColumns[x]
            columns.push(<Column column={modelColumn} onClick={() => {
                if (!this.props.stop) humanPlay(this.props.changeStatus, model, x, this.props.level)
            }}/>)
        }
        return <div className={'scene container'}>{columns}</div>
    }
}
