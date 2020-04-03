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
          <Scene stop={this.state.stop} model={this.state.model} level={this.state.level} changeStatus={(c)=>this.changeStatus(c)}/>

        </article>


      </div>
      <div className={'coltrol-bar right'}>
        <article>
          <span>
          <p>难度</p>
          <label>
            <input type='radio' defaultChecked={true} name={'level'} onClick={()=>this.setLevel(0)} />
            简单
          </label>
          <label>
            <input type='radio' name={'level'} onClick={()=>this.setLevel(1)} />
            中等
          </label>
          <label>
            <input type='radio' name={'level'} onClick={()=>this.setLevel(2)} />
            困难
          </label>
        </span>
          <div>
            <p>高度:{this.state.rowNum}</p>
            <input className={'range'} type='range' step={1} min={5} max={20} defaultValue={defaultRowNum} onChange={(e)=>{this.onChangeRowNum(Number(e.target.value))}}/>
          </div>
          <div>
            <p>宽度:{this.state.columnNum}</p>
            <input className={'range'} type='range' step={1} min={5} max={20} defaultValue={defaultColumnNum} onChange={(e)=>{this.onChangeColumnNum(Number(e.target.value))}}/>
          </div>
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
  onChangeRowNum(w:number){
    this.setState((s:Status)=> Object.assign(s,{rowNum:w}))
  }
  onChangeColumnNum(w:number){
    this.setState((s:Status)=> Object.assign(s,{columnNum:w}))
  }
  setLevel(level:number){
    this.setState((s:Status)=>Object.assign(s,{level:level}))
  }
  changeStatus(change:any){
    this.setState((s:Status)=>Object.assign(s,change))
  }
}

