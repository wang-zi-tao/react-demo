import React, {MouseEventHandler} from 'react';
import {Model, ModelCell, ModelColumn} from "./model";
import imageAI from './resources/AI.svg'
import imageHuman from './resources/human.svg'
import {aiPlay} from "./ai";

function humanPlay(changeStatus: (change: any) => void,
                   model: Model,
                   x: number,
                   level: number,
                   onHumanWin: () => void,
                   onAIWin: () => void,
                   onDraw: () => void) {
    changeStatus({message: ''})
    if (!model.available(x)) {
        changeStatus({message: '不能放在这里'})
        return
    }
    const onTop = !model.put(x, ModelCell.Human)
    if (model.win(ModelCell.Human)) {
        changeStatus({message: '你赢了😀', stop: true})
        onHumanWin()
        return
    }
    if (onTop) {
        changeStatus({message: '不能放在这里'})
        return
    }
    if (model.full()) {
        changeStatus({message: '平局😝', stop: true})
        onDraw()
        return
    }
    if (aiPlay(model, level)) {
        if (model.win(ModelCell.AI)) {
            changeStatus({message: '你输了😝', stop: true})
            onAIWin()
            return
        }
    }
    if (model.full()) {
        changeStatus({message: '平局😝', stop: true})
        onDraw()
        return
    }
}

/**
 * 棋子
 */
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

/**
 * 棋盘列
 */
export class Column extends React.Component<{ column: ModelColumn, onClick: any }, any> {
    render(): any {
        const column = this.props.column
        const cells = column.cells
        const images = cells.map((cell) => <Cell cell={cell}/>)
        return <div className={'column'} onClick={this.props.onClick}>{images}</div>
    }
}

interface SceneProps {
    onHumanWin: () => void;
    onAIWin: () => void;
    onDraw: () => void;
    model: Model;
    changeStatus: (change: any) => void;
    level: number;
    stop: boolean
}

/**
 * 棋盘
 */
export class Scene extends React.Component<SceneProps, any> {
    render(): any {
        const model = this.props.model
        const modelColumns = model.columns
        let columns = []
        for (let x = 0; x < modelColumns.length; x++) {
            const modelColumn = modelColumns[x]
            columns.push(<Column column={modelColumn} onClick={
                () => {
                    if (!this.props.stop) {
                        humanPlay(this.props.changeStatus,
                            model,
                            x,
                            this.props.level,
                            this.props.onHumanWin,
                            this.props.onAIWin,
                            this.props.onDraw)
                    }
                }}/>)
        }
        return <div className={'scene container'}>{columns}</div>
    }
}
