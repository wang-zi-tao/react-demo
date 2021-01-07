import { aiDecision, aiPlay, negamax } from '../src/ai';
import { Model, ModelCell, ModelColumn } from '../src/model';
const AI = ModelCell.AI;
const Human = ModelCell.Human;
test('递归式alpha-beta决策树算法/白盒测试/叶节点', () => {
    expect(negamax(new Model(
        7,
        7,
        [
            new ModelColumn([Human]),
            new ModelColumn([Human]),
            new ModelColumn([AI]),
            new ModelColumn([Human]),
            new ModelColumn([Human]),
            new ModelColumn([AI]),
            new ModelColumn([Human]),
        ]
    ),
    /*玩家*/ ModelCell.AI,
    /*决策树高度*/ 0,
    /*alpha*/ 0,
    /*beta*/ 0,
    /*难度*/ 0,
    /*选择*/ 6))
        .toBeDefined();
    expect(negamax(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human, Human]),
            new ModelColumn([Human, Human, Human, AI]),
            new ModelColumn([Human, Human, AI, Human]),
            new ModelColumn([AI, Human, Human, Human]),
        ]
    ),
        /*玩家*/ ModelCell.AI,
        /*决策树高度*/ 0,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
        .toBe(3);
    expect(negamax(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human, Human]),
            new ModelColumn([Human, Human, Human, AI]),
            new ModelColumn([Human, Human, AI, Human]),
            new ModelColumn([AI, Human, Human, Human]),
        ]
    ),
        /*玩家*/ ModelCell.Human,
        /*决策树高度*/ 0,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
        .toBe(3); expect(negamax(new Model(
            4,
            4,
            [
                new ModelColumn([Human, AI, Human, Human]),
                new ModelColumn([Human, Human, Human, AI]),
                new ModelColumn([Human, Human, AI, Human]),
                new ModelColumn([AI, Human, Human, Human]),
            ]
        ),
        /*玩家*/ ModelCell.Human,
        /*决策树高度*/ 0,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
            .toBe(3);
    expect(negamax(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human, Human]),
            new ModelColumn([Human, Human, Human, AI]),
            new ModelColumn([Human, AI]),
            new ModelColumn([AI, Human]),
        ]
    ),
            /*玩家*/ ModelCell.Human,
            /*决策树高度*/ 0,
            /*alpha*/ 0,
            /*beta*/ 0,
            /*难度*/ 0,
            /*选择*/ 3).nextColumn)
        .toBe(3);
})
test('递归式alpha-beta决策树算法/白盒测试/分支节点/[列已满,列未满]', () => {
    expect(negamax(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human, Human]),
            new ModelColumn([Human, Human, Human, AI]),
            new ModelColumn([Human, Human, AI]),
            new ModelColumn([AI, Human]),
        ]
    ),
        /*玩家*/ ModelCell.Human,
        /*决策树高度*/ 1,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
        .toBeDefined();
})
test('递归式alpha-beta决策树算法/白盒测试/分支节点/[onTop,!onTop]', () => {
    expect(negamax(new Model(
        7,
        7,
        [
            new ModelColumn([Human, Human, Human]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([AI, AI, AI]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([]),
        ]
    ),
        /*玩家*/ ModelCell.Human,
        /*决策树高度*/ 1,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
        .toBeDefined();
})
test('递归式alpha-beta决策树算法/白盒测试/分支节点/递归调用', () => {
    expect(negamax(new Model(
        7,
        7,
        [
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, Human]),
            new ModelColumn([AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, Human, AI]),
        ]
    ),
        /*玩家*/ ModelCell.AI,
        /*决策树高度*/ 7,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 1,
        /*选择*/ 1).nextColumn)
        .toBeDefined();
    expect(negamax(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, Human, Human]),
            new ModelColumn([Human, Human]),
            new ModelColumn([AI, Human]),
        ]
    ),
        /*玩家*/ ModelCell.Human,
        /*决策树高度*/ 1,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 3).nextColumn)
        .toBeDefined();
})
test('递归式alpha-beta决策树算法/白盒测试/分支节点/剪枝', () => {
    expect(negamax(new Model(
        7,
        7,
        [
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, Human]),
            new ModelColumn([AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, AI, Human]),
            new ModelColumn([Human, Human, AI]),
        ]
    ),
        /*玩家*/ ModelCell.AI,
        /*决策树高度*/ 2,
        /*alpha*/ 0,
        /*beta*/ 0,
        /*难度*/ 0,
        /*选择*/ 1).nextColumn)
        .toBeDefined();
})
// test('递归式alpha-beta决策树算法/白盒测试/难度', () => {
//     expect(negamax(new Model(
//         7,
//         7,
//         [
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//         ]
//     ),
//     /*玩家*/ ModelCell.AI,
//     /*决策树高度*/ 0,
//     /*alpha*/ 0,
//     /*beta*/ 0,
//     /*难度*/ -1,
//     /*选择*/ 6))
//         .toThrow(Error);
//     expect(negamax(new Model(
//         7,
//         7,
//         [
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//         ]
//     ),
//         /*玩家*/ ModelCell.AI,
//         /*决策树高度*/ 0,
//         /*alpha*/ 0,
//         /*beta*/ 0,
//         /*难度*/ 3,
//         /*选择*/ 6))
//         .toThrow();
//     expect(negamax(new Model(
//         7,
//         7,
//         [
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//         ]
//     ),
//         /*玩家*/ ModelCell.AI,
//         /*决策树高度*/ 0,
//         /*alpha*/ 0,
//         /*beta*/ 0,
//         /*难度*/ 0,
//         /*选择*/ 6))
//         .toBeDefined();
//     expect(negamax(new Model(
//         7,
//         7,
//         [
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//         ]
//     ),
//         /*玩家*/ ModelCell.AI,
//         /*决策树高度*/ 0,
//         /*alpha*/ 0,
//         /*beta*/ 0,
//         /*难度*/ 1,
//         /*选择*/ 6))
//         .toBeDefined();
//     expect(negamax(new Model(
//         7,
//         7,
//         [
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//             new ModelColumn([Human]),
//             new ModelColumn([AI]),
//             new ModelColumn([Human]),
//         ]
//     ),
//         /*玩家*/ ModelCell.AI,
//         /*决策树高度*/ 0,
//         /*alpha*/ 0,
//         /*beta*/ 0,
//         /*难度*/ 2,
//         /*选择*/ 6))
//         .toBeDefined();

// })

test('ai决策/白盒测试', () => {
    expect(aiDecision(new Model(
        7,
        7,
        [
            new ModelColumn([Human, Human]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([AI, AI, AI]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([Human, Human]),
        ]
    ), 1)).toBe(3)
    expect(aiDecision(new Model(
        7,
        7,
        [
            new ModelColumn([Human, Human, Human]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([AI, AI]),
            new ModelColumn([AI]),
            new ModelColumn([]),
            new ModelColumn([Human]),
        ]
    ), 1)).toBe(0)
    expect(aiDecision(new Model(
        7,
        7,
        [
            new ModelColumn([Human, Human]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([AI]),
            new ModelColumn([AI, Human]),
            new ModelColumn([]),
            new ModelColumn([Human, AI]),
        ]
    ), 1)).toBeDefined()
})

test('ai下棋/白盒测试', () => {
    expect(aiPlay(new Model(
        7,
        7,
        [
            new ModelColumn([Human, Human]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([AI, AI, AI]),
            new ModelColumn([]),
            new ModelColumn([]),
            new ModelColumn([Human, Human]),
        ]
    ), 1)).toBe(true)
    expect(aiPlay(new Model(
        4,
        4,
        [
            new ModelColumn([Human, AI, Human, Human]),
            new ModelColumn([Human, Human, Human, AI]),
            new ModelColumn([Human, Human, AI, Human]),
            new ModelColumn([AI, Human, Human, Human]),
        ]
    ), 1)).toBe(false)
})