const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export function getTiles() {
    let tiles = [];
    for(let i = 1; i < 4; i ++) {
      for(let j = 1; j < 10; j++) {
        for(let k = 0; k < 4; k++) {
          tiles.push(i * 10 + j);
        }
      }
    }
    return tiles;
  }
  
export const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function countTiles(hand) {
    const counter = {};
    hand.forEach((t) => {
        if(!(t in counter)) 
            counter[t] = 0;
        counter[t]++;
    });
    return counter;
}

export function havePong(hand, tile) {
    const counter = countTiles(hand);
    return counter[tile] === 2;
}

export function haveKong(hand, tile = null) {
    const counter = countTiles(hand);
    if(tile !== null) return counter[tile] === 3;
    for(let val of Object.values(counter)) {
        if(val === 4) return true;
    }
    return false;
}

export function getKongTile(hand) {
    const counter = countTiles(hand);
    const kong_tiles = [];
    for(let [tile, val] of Object.entries(counter)) {
        if(val === 4) kong_tiles.push(parseInt(tile));
    }
    return kong_tiles;
}

export function isHuPai(hand) {
    // Check if the hand is HuPai
    // First, check at least a pair is present in hand
    // Then, check the hand without the pair is all made by 3 groups (or "meld")
    if(hand.length % 3 !== 2) return false;

    const counter = countTiles(hand);
    for(const [k, v] of Object.entries(counter)) {
        let new_counter = Object.assign({}, counter);
        if(v >= 2) {
            new_counter[k] -= 2;
            if(new_counter[k] === 0)
                delete new_counter[k];
            if(isMelds(new_counter)) return true;
        }
    }

    return false;
}

function isMelds(counter) {
    // helper function to check if it is HuPai
    // All tiles left in hand should be able to form melds - like "1","2","3" or "1","1","1"
    if(sum(Object.values(counter)) === 0) return true;
    for(const [k, v] of Object.entries(counter)) {
        let int_k = parseInt(k);
        let new_counter = Object.assign({}, counter);
        if(v >= 3) {
            new_counter[k] -= 3;
            if(new_counter[k] === 0)
                delete new_counter[k];
            if(isMelds(new_counter)) return true;
        } else if((int_k + 1) in new_counter && (int_k + 2) in new_counter) {
            for(let i = 0; i < 3; i++) {
                new_counter[int_k + i]--;
                if(new_counter[int_k + i] === 0)
                    delete new_counter[int_k + i];
            }
            if(isMelds(new_counter)) return true;
        }
    }
    return false;
}

// const counter = countTiles([1,2,2,3,3,4,97,98,99]);
// console.log(groupBy3(counter));

// let hand = [1,2,3,4,4];
// console.log(isHuPai(hand)); // true

// hand = [1,2,3,4,5];
// console.log(isHuPai(hand)); // false

// hand = [1,2,2,3,3,4,4,5];
// console.log(isHuPai(hand)); // false

// hand = [2,2];
// console.log(isHuPai(hand)); // true

// hand = [1];
// console.log(isHuPai(hand)); // false

// hand = [1,2,2,3,3,4,4,4];
// console.log(isHuPai(hand)); // true

// hand = [1,1,1,1,2,3,3,3];
// console.log(isHuPai(hand)); // true

// hand = [1,1,1,2,2,3,3,3];
// console.log(isHuPai(hand)); // true