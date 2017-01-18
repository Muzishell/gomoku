function ai(game) {
    this.socket;
    this.moves = [
	[1, 1],
        [0, 1],
        [1, 0],
	[1, -1],
        [-1, -1],
        [0, -1],
	[-1, 0],
        [-1, 1],
    ];
    
    this.pawnTaken = 0;
    
    this.map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], // 3
	[0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 4
	[0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 5
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 6
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 7
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 9
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 11
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 12
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 13
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 14
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 15
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 16
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 17
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 18
    ];// 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18
    
    this.value = {
	'eaten' : 60,
	'4Apawns' : 700,
	'3Apawns' : 120,
	'2Apawns' : 42,
	'4Epawns' : 600,
	'3Epawns' : 300,
	'middle_xy' : 10,
	'pawnCoef' : 100,
    };
    
    this.valueMap = [];
    
    this.isTherePawnAround = function(x, y) {
	var i = 0;
	
	while (i < 8)
	{
	    if ((x + this.moves[i][0] >= 0) && (y + this.moves[i][1] >= 0) && 
		(x + this.moves[i][0] <= 18) && (y + this.moves[i][1] <= 18))
		if (this.map[x + this.moves[i][0]][y + this.moves[i][1]] != 0)
		    return 1;
	    i += 1;
	}
	return 0;
    }

    this.clearArray = function(array) {
	var i = 0;
	var y = 0;
	
        while (i < 19)
        {
	    y = 0;
	    while (y < 19)
	    {
		array[i][y] = 0;
		y += 1;
	    }
            i += 1;
        }
    }
    
    this.emptyMap = function() {
	var i = 0;
	var y = 0;

	while (i < 19)
	{
	    y = 0;
	    while (y < 19)
	    {
		if (this.map[i][y] != 0)
		    return false;
		y += 1;
	    }
	    i += 1;
	}
	return true;
    }
    
    this.getIndexWithVector = function(pawn_idx, vec, inc) {
        return (pawn_idx + (vec == 0 ? vec : (vec > 0 ? vec + inc : vec - inc)));
    }
    
    this.checkLineForPawn = function(x, y, inc_x, inc_y, max, tileType) {
	var i = 0;
	var cnt = 0;
	var x_res;

	while (cnt < max)
	{
	    x_res = (x + (inc_x == 0 ? inc_x : (inc_x > 0 ? inc_x + i : inc_x - i)));
	    if (x_res < 0 || x_res > 18)
		return false;
	    if (this.map[x_res][(y + (inc_y == 0 ? inc_y : (inc_y > 0 ? inc_y + i : inc_y - i)))] != tileType)
		return false;
	    i += 1;
	    cnt += 1;
	}
	return true;
    }
      
    this.checkIfEmptyAfter = function(x, y, vec, max) {
	var tmp = this.getIndexWithVector(x, vec[0], max);

	if (tmp >= 0 && tmp < 19)
	    if (this.map[tmp][this.getIndexWithVector(y, vec[1], max)] == 0)
	    return true;
	return false;
    }

    this.checkVectorForFive = function(x, y, vec1, vec2, playNum, size) {
	var vec1_max = size;
	var vec2_max = 0;

	while (vec2_max <= size)
	{
	    if (this.checkLineForPawn(x, y, this.moves[vec1][0], this.moves[vec1][1], vec1_max, playNum) == true)
		if (this.checkIfEmptyAfter(x, y, this.moves[vec1], vec1_max + 1) == true ||
		    this.checkIfEmptyAfter(x, y, this.moves[vec2], vec2_max + 1) == true)
		    if (this.checkLineForPawn(x, y, this.moves[vec2][0], this.moves[vec2][1], vec2_max, playNum) == true)
			return true;
	    vec1_max -= 1;
	    vec2_max += 1;
	}
	return false;
    };
    
    this.areThereFivePawn = function (x, y, size, player) {
	// Problème possible si sur le bord (!!!!!!!!!!!!!!)
	if (this.checkVectorForFive(x, y, 0, 4, player, size) == true)
	    return true;
	if (this.checkVectorForFive(x, y, 1, 5, player, size) == true)
	    return true;
	if (this.checkVectorForFive(x, y, 2, 6, player, size) == true)
	    return true;
	if (this.checkVectorForFive(x, y, 3, 7, player, size) == true)
	    return true;
	return false;
    };

    this.get1DP = function(x, y) {
	return (x + y * this.col_nb);
    }
    
    this.getVectorVal = function(x, vector, inc) {
	return (x + (vector == 0 ? vector : (vector > 0 ? vector + inc : vector - inc)));
}

    this.vulnerablePawn = function(x, y, player, player2, map) {
	var i = 0;
	var x_res;

	while (i < 8)
	{
	    x_res1 = this.getVectorVal(x, this.moves[i][0], 0);
	    x_res2 = this.getVectorVal(x, this.moves[i][0], 1);
	    x_res3 = this.getVectorVal(x, this.moves[(i > 3 ? i - 4 : i + 4)][0], 1);
	    if (x_res1 >= 0 && x_res1 < 19 && map[x_res1][this.getVectorVal(y, this.moves[i][1], 0)] == player)
		if (x_res2 >= 0 && x_res2 < 19 && map[x_res2][this.getVectorVal(y, this.moves[i][1], 1)] == player2)
		    if (x_res3 >= 0 && x_res3 < 19 && map[x_res3][this.getVectorVal(y, this.moves[(i > 3 ? i - 4 : i + 4)][1], 1)] == 0)
			return true;
	    i += 1;
	}
	return false;
    }
    
    this.arePawnTaken = function(x, y, player, player2, map) {
	var i = 0;
	var x_res1;
	var x_res2;
	var x_res3;

	while (i < 8)
        {
	    x_res1 = this.getVectorVal(x, this.moves[i][0], 0);
	    x_res2 = this.getVectorVal(x, this.moves[i][0], 1);
	    x_res3 = this.getVectorVal(x, this.moves[i][0], 2);
	    if (x_res1 >= 0 && x_res1 < 19 && x_res2 >= 0 && x_res2 < 19 && x_res3 >= 0 && x_res3 < 19)
		if (map[x_res1][this.getVectorVal(y, this.moves[i][1], 0)] == player2)
		    if (map[x_res2][this.getVectorVal(y, this.moves[i][1], 1)] == player2)
			if (this.map[x_res3][this.getVectorVal(y, this.moves[i][1], 2)] == player)
			    return true;
            i += 1;
        }
        return false;
    }

    this.assignValue = function(x, y, player) {
	var value = 0;
	var player2 = 0;

	player2 = (player % 2) + 1;
	
	if (this.vulnerablePawn(y, x, player, player2, this.map) == true)
	{
	    if (game.players[0].pawn != 0)
		value -= (this.value['eaten'] * game.players[0].pawn);
	    else
		value -= this.value['eaten'];
	}
	
	if (this.arePawnTaken(y, x, player, player2, this.map) == true)
	{
	    if (this.pawnTaken == 0)
		value += this.value['pawnCoef'] + 30;
	    else
		value += (this.pawnTaken * this.value['pawnCoef'])
	}

	if ((this.areThereFivePawn(x, y, 4, player)) == true)
	    value += this.value['4Apawns'];
	else if ((this.areThereFivePawn(x, y, 3, player)) == true)
	    value += this.value['3Apawns'];
	else if ((this.areThereFivePawn(x, y, 2, player)) == true)
	    value += this.value['2Apawns'];
	
	if ((this.areThereFivePawn(x, y, 4, player2)) == true)
	    value += this.value['4Epawns'];
	else if ((this.areThereFivePawn(x, y, 3, player2)) == true)
	    value += this.value['3Epawns'];
	
	return [x, y, value];
    }
    
    this.getMax = function(x, y, pawn_type, depth, tmp) {
	if (depth == 0)
	    return this.assignValue(x, y, pawn_type);

	var max = -10000;
	var maxI = 0;
	var maxJ = 0;
	var i = 18;
	var j;
	var tmp;

	while (i >= 0)
	{
	    j = 18;
	    while (j >= 0)
	    {
		if (this.map[i][j] == 0 && this.isTherePawnAround(i, j) == 1)
		{
		    this.map[i][j] = pawn_type;
		    tmp = this.getMin(x, y, 1, depth - 1);
		    if (tmp[2] > max || (tmp[2] == max && Math.floor((Math.random() * 10) + 1) % 2 == 0))
		    {
			maxI = i;
			maxj = j;
			max = tmp[2];
			if (max > tmp)
			{
			    this.map[i][j] = 0;
			    return [maxI, maxJ, max];
			}
		    }
		    this.map[i][j] = 0;
		}
		j--;
	    }
	    i--;
	}
	return [maxI, maxJ, max];
    }

    this.getMin = function(x, y, pawn_type, depth, tmp) {
	if (depth == 0)
	    return this.assignValue(x, y, pawn_type);

	var min = 100000;
	var maxI = 0;
	var maxJ = 0;
	var i = 18;
	var j;
	var tmp;

	while (i >= 0)
	{
	    j = 18;
	    while (j >= 0)
	    {
		if (this.map[i][j] == 0 && this.isTherePawnAround(i, j) == 1)
		{
		    this.map[i][j] = pawn_type;
		    tmp = this.getMax(x, y, 2, depth - 1, min);
		    if (tmp[2] < min || (tmp[2] == min && Math.floor((Math.random() * 10) + 1) % 2 == 1))
		    {
			maxI = i;
			maxj = j;
			min = tmp[2];
			if (tmp[2] < tmp)
			{
			    this.map[i][j] = 0;
			    return [maxI, maxJ, min];
			}
		    }
		    this.map[i][j] = 0;
		}
		j--;
	    }
	    i--;
	}
	return [maxI, maxJ, min];
    }

    this.minMaxLoop = function(depth, pawn_type) {
	var max = -10000;
	var tmp;
	var maxX = -1;
	var maxY = -1;
	var i = 18;
	var j;

	while (i >= 0)
	{
	    j = 18;
	    while (j >= 0)
	    {
		if (this.map[i][j] == 0 && this.isTherePawnAround(i, j) == 1)
		{
		    this.map[i][j] = 2;
		    tmp = this.getMin(i, j, 1, depth - 1, max);
//		    tmp = this.assignValue(i, j, 2)
		    if (tmp[2] > max || (tmp[2] == max && Math.floor((Math.random() * 10) + 1) % 2 == 0))
		    {
			max = tmp[2];
			maxX = i;
			maxY = j;
		    }
		    this.map[i][j] = 0;
		}
		j--;
	    }
	    i--;
	}
	return [maxX, maxY];
    }

    this.findPlay = function(pawn_type, pawnTaken, map) {
	if (this.emptyMap() == true)
	    return ([18 / 2, 18 / 2]);

	var depth = 3;

	var y = 0;
	var x;
	var i = 0;

	while (i < (19 * 19))
	{
	    x = 0;
	    while (x < 19)
	    {
		this.map[y][x] = map[i];
		x += 1;
		i += 1;
	    }
	    y += 1;
	}
	this.pawnTaken = game.players[1].pawn;
	return this.minMaxLoop(depth, pawn_type);
    }
};

exports = module.exports = ai;
