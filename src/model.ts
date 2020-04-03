
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
    put(x:number,cell:ModelCell):boolean{
        if(this.columns[x].cells.length>=this.rowNum){
            return false
        }
        const modelCells = this.columns[x].cells;
        modelCells.push(cell)
        this.lastY=modelCells.length-1
        this.lastX=x
        return this.lastY!=this.rowNum
    }
    available(x:number):boolean{
        return this.columns[x].cells.length<this.rowNum
    }
    pick(x:number){
        this.columns[x].cells.pop()
    }
    clone():Model{
        return new Model(this.columnNum,this.rowNum,this.columns.map(c=>c))
    }
    private detectAndCountTwoWay(x:number,y:number,direction_x:number,direction_y:number,player:ModelCell):number{
        return (this.detectAndCount(x,y,direction_x,direction_y,player)
            +this.detectAndCount(x-direction_x,y-direction_y,-direction_x,-direction_y,player))
    }
    private detectAndCount(x:number,y:number,direction_x:number,direction_y:number,player:ModelCell):number{
        let count;
        for(count = 0; this.get(x,y)===player; count++){
            x+=direction_x
            y+=direction_y
        }
        return count;
    }
    win(player:ModelCell):boolean{
        const x=this.lastX
        const y=this.lastY
        return (this.detectAndCountTwoWay(x,y,1,0,player)==4
            ||this.detectAndCountTwoWay(x,y,0,1,player)==4
            ||this.detectAndCountTwoWay(x,y,1,1,player)==4
            ||this.detectAndCountTwoWay(x,y,1,-1,player)==4)
    }
    full():boolean{
        for(let i=0;i<this.columnNum;i++){
            if(this.available(i)){
                return false
            }
        }
        return true
    }
}
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
