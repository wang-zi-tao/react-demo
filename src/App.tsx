import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Scene} from "./scene";
import {Model,creatModel} from "./model";
const defaultColumnNum=7
const defaultRowNum=7
export class Status {
  level:number=0;
  rowNum:number=defaultRowNum;
  columnNum:number=defaultColumnNum;
  stop:boolean=false;
  message:string="";
  humanWinCount:number=0;
  aiWinCount:number=0;
  drawCount:number=0;
  model:Model
  constructor() {
    this.model=creatModel(this.columnNum,this.rowNum)
  }
}
export class App extends React.Component<any, Status>{
  constructor(props:any) {
    super(props);
    this.state=new Status();
  }
  render(): any {
    return (
        <div className={'container'}>
      <div className={'left'}>
        <article>
          <Scene
              onAIWin={()=>this.onAIWin()}
              onHumanWin={()=>this.onHumanWin()}
              onDraw={()=>this.onDraw()}
              stop={this.state.stop}
              model={this.state.model}
              level={this.state.level}
              changeStatus={(c)=>this.changeStatus(c)}
          />

        </article>


      </div>
      <div className={'coltrol-bar right'}>
        <article>
          <h1>四子连线</h1>
          <a onClick={()=>alert('四子连线是一种简单的棋类游戏，点击棋盘上的列即可将棋子放在列顶端，先让4个棋子连成一条线的玩家获胜。\n' +
              '在棋盘最低一行放棋子且没有获胜时，必须在其他地方重新放棋子。')}>
            帮助
          </a>
          <span>
          <p>难度</p>
          <label>
            <input type='radio' defaultChecked={true} name={'level'} onClick={()=>this.setLevel(0)} />
            简单
          </label>
          <label>
            <input type='radio'defaultChecked={true}  name={'level'} onClick={()=>this.setLevel(1)} />
            中等
          </label>
          <label>
            <input type='radio' name={'level'} onClick={()=>this.setLevel(2)} />
            困难
          </label>
        </span>
          <div>
            <p>高度:{this.state.rowNum}</p>
            <input
                className={'range'}
                type='range'
                step={1}
                min={5}
                max={8}
                defaultValue={defaultRowNum}
                onChange={(e)=>{this.onChangeRowNum(Number(e.target.value))}}
            />
          </div>
          <div>
            <p>宽度:{this.state.columnNum}</p>
            <input
                className={'range'}
                type='range'
                step={1}
                min={5}
                max={8}
                defaultValue={defaultColumnNum}
                onChange={(e)=>{this.onChangeColumnNum(Number(e.target.value))}}
            />
          </div>
          <p>你赢了{this.state.humanWinCount}次</p>
          <p>你输了{this.state.aiWinCount}次</p>
          <p>平局{this.state.drawCount}次</p>
          <button onClick={()=>this.newGame()}>
            新游戏
          </button>
          <p className={'message'}>{this.state.message}</p>

        </article>

      </div>
    </div>)
  }
  newGame() {
    this.setState((s:Status)=>Object.assign(s,{model:creatModel(s.columnNum,s.rowNum),stop:false,message:''}))
  }
  onHumanWin(){
    let newValue=this.state.humanWinCount+1
    this.setState((s:Status)=>Object.assign(s,{humanWinCount:newValue}))
  }
  onAIWin(){
    let newValue=this.state.aiWinCount+1
    this.setState((s:Status)=>{Object.assign(s,{aiWinCount:newValue})})
  }
  onDraw(){
    let newValue=this.state.drawCount+1
    this.setState((s:Status)=>Object.assign(s,{drawCount:newValue}))
  }
  onChangeRowNum(w:number){
    if(w>this.state.rowNum){
      this.onChangeColumnNum(w)
    }
    this.setState((s:Status)=> Object.assign(s,{rowNum:w}))
  }
  onChangeColumnNum(w:number){
    if(w<this.state.rowNum){
      this.onChangeRowNum(w)
    }
    this.setState((s:Status)=> Object.assign(s,{columnNum:w}))
  }
  setLevel(level:number){
    this.setState((s:Status)=>Object.assign(s,{level:level}))
  }
  changeStatus(change:any){
    this.setState((s:Status)=>Object.assign(s,change))
  }
}

