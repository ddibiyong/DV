function convertUnits(x) {
    const SET_SIZE = 64;
    const BOX_SIZE = 54 * SET_SIZE; // 1상자 = 54셋 = 3456개

    const a = Math.floor(x / BOX_SIZE); // 상자 수
    const remainderAfterBoxes = x % BOX_SIZE;

    const b = Math.floor(remainderAfterBoxes / SET_SIZE); // 셋 수
    const c = remainderAfterBoxes % SET_SIZE; // 개 수

    return [a, b, c];
}

// 예시
const x = 1693;
const [a, b, c] = convertUnits(x);
console.log(`${x} = ${a}상자 ${b}셋 ${c}개`);