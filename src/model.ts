
/**
 * 棋盘模型的计算与维护,包括下棋,单步撤销判断输赢等功能
 */

//棋盘模型
export class Model {
    columnNum:number;
    rowNum:number;
    lastX:number;
    lastY:number;
    columns:ModelColumn[];
    constructor(columnNum:number,rowNum:number,columns:ModelColumn[]){
        this.columnNum=columnNum
        this.rowNum=rowNum
        this.columns=columns
        this.lastX=NaN
        this.lastY=NaN
    }
    //获取格子里的棋子,空为undefined
    get(x:number,y:number):ModelCell|undefined{
        const column=this.columns[x]
        if(column===undefined){
            return undefined
        }
        return column.cells[y]
    }
    put_temporary(x:number,cell:ModelCell){
        if(this.columns[x].cells.length>=this.rowNum){
            return
        }
        this.columns[x].cells.push(cell)
    }
    //放置棋子
    put(x:number,cell:ModelCell):boolean{
        if(this.columns[x].cells.length>=this.rowNum){
            return false
        }
        const modelCells = this.columns[x].cells;
        modelCells.push(cell)
        this.lastY=modelCells.length-1
        this.lastX=x
        return this.lastY!==this.rowNum-1
    }
    //判断能不能放棋子
    available(x:number):boolean{
        const modelColumn = this.columns[x];
        if(modelColumn===undefined){
            return false
        }
        return modelColumn.cells.length<this.rowNum
    }
    //单步撤销
    pick(x:number){
        this.columns[x].cells.pop()
    }
    //复制棋盘
    clone():Model{
        return new Model(this.columnNum,this.rowNum,this.columns.map(c=>c))
    }
    //从(x,y)沿着(direction_x,direction_y)方向双向探测该玩家连线棋子数量
    private detectAndCountTwoWay(x:number,y:number,direction_x:number,direction_y:number,player:ModelCell):number{
         let r=(this.detectAndCount(x,y,direction_x,direction_y,player)
            +this.detectAndCount(x-direction_x,y-direction_y,-direction_x,-direction_y,player))
        return r
    }
    //假设(x,y)已放置该玩家的棋子,从(x,y)沿着(direction_x,direction_y)方向双向探测该玩家连线棋子数量
    private detectAndCountTwoWayIfPut(x:number,y:number,direction_x:number,direction_y:number,player:ModelCell):number{
        return (this.detectAndCount(x+direction_x,y+direction_y,direction_x,direction_y,player)
            +this.detectAndCount(x-direction_x,y-direction_y,-direction_x,-direction_y,player)
            +1)
    }
    //从(x,y)沿着(direction_x,direction_y)方向单向探测该玩家连线棋子数量
    private detectAndCount(x:number,y:number,direction_x:number,direction_y:number,player:ModelCell):number{
        let count;
        for(count = 0; this.get(x,y)===player; count++){
            x+=direction_x
            y+=direction_y
        }
        return count;
    }
    //判断是否胜利
    win(player:ModelCell):boolean{
        const x=this.lastX
        const y=this.lastY
        return (this.detectAndCountTwoWay(x,y,1,0,player)>=4
            ||this.detectAndCountTwoWay(x,y,0,1,player)>=4
            ||this.detectAndCountTwoWay(x,y,1,1,player)>=4
            ||this.detectAndCountTwoWay(x,y,1,-1,player)>=4)
    }
    //判断是否在(x,y)上放棋子就胜利
    winIfPut(x:number,y:number,player:ModelCell):boolean{
        return (this.detectAndCountTwoWayIfPut(x,y,1,0,player)>=4
            ||this.detectAndCountTwoWayIfPut(x,y,0,1,player)>=4
            ||this.detectAndCountTwoWayIfPut(x,y,1,1,player)>=4
            ||this.detectAndCountTwoWayIfPut(x,y,1,-1,player)>=4)
    }
    //判断棋盘是否已满
    full():boolean{
        for(let i=0;i<this.columnNum;i++){
            if(this.columns[i].cells.length < this.rowNum-1){
                return false
            }
        }
        return true
    }
}
//棋盘列
export class ModelColumn {
    cells:ModelCell[]
    constructor(cells:ModelCell[]) {
        this.cells=cells
    }
    get(y:number):ModelCell{
        return this.cells[y]
    }
    clone():ModelColumn{
        return new ModelColumn(this.cells.map(c=>c))
    }
}
//棋盘格子,空格为undefined
export enum ModelCell {
    Human,
    AI
}
export function creatModel(columnNum:number,rowNum:number):Model {
    let columns=[]
    for(let i=0;i<columnNum;i++){
        columns.push(new ModelColumn([]))
    }
    return new Model(columnNum,rowNum,columns)
}
