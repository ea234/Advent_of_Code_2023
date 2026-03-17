import { debug } from 'console';
import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/10
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Pipe_Maze.js
 * 
 * Day 10: Pipe Maze
 * 
 *   0  7-F7-
 *   1  .FJ|7
 *   2  SJLL7
 *   3  |F--J
 *   4  LJ.LJ
 * 
 *     0  R3C0   R2C1  - from R2C0 to R3C0  cur_pos_char F
 *     1  R2C0   R4C0  - from R2C0 to R4C0  cur_pos_char |
 *     2  R3C0   R4C1  - from R3C0 to R4C1  cur_pos_char L
 *     3  R3C1   R4C0  - from R4C0 to R3C1  cur_pos_char J
 *     4  R4C1   R3C2  - from R4C1 to R3C2  cur_pos_char F
 *     5  R3C3   R3C1  - from R3C1 to R3C3  cur_pos_char -
 *     6  R3C4   R3C2  - from R3C2 to R3C4  cur_pos_char -
 *     7  R2C4   R3C3  - from R3C3 to R2C4  cur_pos_char J
 *     8  R3C4   R2C3  - from R3C4 to R2C3  cur_pos_char 7
 *     9  R1C3   R2C4  - from R2C4 to R1C3  cur_pos_char L
 *    10  R0C3   R2C3  - from R2C3 to R0C3  cur_pos_char |
 *    11  R1C3   R0C2  - from R1C3 to R0C2  cur_pos_char 7
 *    12  R1C2   R0C3  - from R0C3 to R1C2  cur_pos_char F
 *    13  R0C2   R1C1  - from R0C2 to R1C1  cur_pos_char J
 *    14  R2C1   R1C2  - from R1C2 to R2C1  cur_pos_char F
 *    15  R1C1   R2C0  - from R1C1 to R2C0  cur_pos_char J
 *    16       - from R2C1 to   cur_pos_char S
 * 
 *   0  ..F7.
 *   1  .FJ|.
 *   2  SJ.L7
 *   3  |F--J
 *   4  LJ...
 * 
 * Result Part 1 = 8.5
 * Result Part 2 = 0
 * 
 */

type PropertieMap = Record< string, string >;

const TILE_VERTICAL_PIPE_NORTH_AND_SOUTH : string = "|"; 
const TILE_HORIZONTAL_PIPE_EAST_AND_WEST : string = "-"; 
const TILE_90_DEGREE_NORTH_AND_EAST      : string = "L"; 
const TILE_90_DEGREE_NORTH_AND_WEST      : string = "J"; 
const TILE_90_DEGREE_SOUTH_AND_WEST      : string = "7"; 
const TILE_90_DEGREE_SOUTH_AND_EAST      : string = "F"; 
const TILE_FLOOR                         : string = ".";
const TILE_START_POSITION                : string = "S";
const TILE_NOT_GRID                      : string = "Q";


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while (str_result.length < pPadLeft)
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function getStartTileChar( hash_map : PropertieMap, pRow : number, pCol : number ) : string 
{
    let tile_north : string = ( hash_map[ "R" + ( pRow - 1 ) + "C" + pCol ] ?? TILE_NOT_GRID );
    let tile_south : string = ( hash_map[ "R" + ( pRow + 1 ) + "C" + pCol ] ?? TILE_NOT_GRID );

    let tile_west : string = ( hash_map[ "R" + pRow  + "C" + ( pCol - 1 ) ] ?? TILE_NOT_GRID );
    let tile_east : string = ( hash_map[ "R" + pRow  + "C" + ( pCol + 1 ) ] ?? TILE_NOT_GRID );

    let vertical_above  : string[] = [ TILE_VERTICAL_PIPE_NORTH_AND_SOUTH, TILE_90_DEGREE_SOUTH_AND_WEST, TILE_90_DEGREE_SOUTH_AND_EAST ];
    let vertical_bottom : string[] = [ TILE_VERTICAL_PIPE_NORTH_AND_SOUTH, TILE_90_DEGREE_NORTH_AND_WEST, TILE_90_DEGREE_NORTH_AND_EAST ];

    let horizontal_east : string[] = [ TILE_HORIZONTAL_PIPE_EAST_AND_WEST, TILE_90_DEGREE_NORTH_AND_WEST, TILE_90_DEGREE_SOUTH_AND_WEST ];
    let horizontal_west : string[] = [ TILE_HORIZONTAL_PIPE_EAST_AND_WEST, TILE_90_DEGREE_NORTH_AND_EAST, TILE_90_DEGREE_NORTH_AND_EAST ];

    /*
     * Check Position vertical
     * Bottom-Tile must have an upwards direction.
     * The bottom-tile must connect to the north
     * 
     * The above-tile must connect to the south
     * 
     */
    if ( vertical_above.includes( tile_north ) && vertical_bottom.includes( tile_south ) ) return TILE_VERTICAL_PIPE_NORTH_AND_SOUTH;

    if ( horizontal_east.includes( tile_east ) && horizontal_west.includes( tile_west ) ) return TILE_HORIZONTAL_PIPE_EAST_AND_WEST;

    if ( vertical_above.includes( tile_north ) && horizontal_west.includes( tile_west ) ) return TILE_90_DEGREE_NORTH_AND_WEST;
    if ( vertical_above.includes( tile_north ) && horizontal_east.includes( tile_east ) ) return TILE_90_DEGREE_NORTH_AND_EAST;

    if ( vertical_bottom.includes( tile_south ) && horizontal_west.includes( tile_west ) ) return TILE_90_DEGREE_SOUTH_AND_WEST;
    if ( vertical_bottom.includes( tile_south ) && horizontal_east.includes( tile_east ) ) return TILE_90_DEGREE_SOUTH_AND_EAST;


    return TILE_NOT_GRID;
}


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row,3) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? TILE_FLOOR;
        }

        str_result += "\n";
    }

    return str_result;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the grid
     * *******************************************************************************************************
     */
    let hash_map : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    let grid_start_row : number = 0;
    let grid_start_col : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input: string = cur_input_str[ grid_cols ] ?? ".";

            let hash_map_key = "R" + grid_rows + "C" + grid_cols;

            hash_map[ hash_map_key ] = cur_char_input;

            if ( cur_char_input == TILE_START_POSITION )
            {
                grid_start_row = grid_rows;

                grid_start_col = cur_col1;
            }
        }

        grid_rows++;
    }

    grid_cols++;

    /*
     * *******************************************************************************************************
     * Traversing the grid
     * *******************************************************************************************************
     */
//    let cur_pos_row : number = grid_start_row;
 //   let cur_pos_col : number = grid_start_col;

    let cur_pos_char : string = getStartTileChar( hash_map, grid_start_row, grid_start_col );;

    let coords_cur : string = "R" + grid_start_row  + "C" + grid_start_col;
    let coords_from : string = coords_cur;
    let coords_to : string = coords_cur;

    let coords_1 : string = "";
    let coords_2 : string = "";

    let count_nr : number = 0; 

    let debug_map : PropertieMap = {};

    let row_delta : number = 0;
    let col_delta : number = 0;

    if ( pKnzDebug )
    {
        console.log( getDebugMap( hash_map, grid_rows, grid_cols ));
    }


    let row_cur : number = grid_start_row;
    let col_cur : number = grid_start_col;

    while (( cur_pos_char !== TILE_START_POSITION ) && ( count_nr < 30_000_000) ) 
    {
        const reg_ex_coords = coords_cur.match(/^R(\d+)C(\d+)$/i);

        if (reg_ex_coords) 
        { 
            row_cur = Number( reg_ex_coords[ 1 ] );
            col_cur = Number( reg_ex_coords[ 2 ] );
        }

        coords_1 = "";
        coords_2 = "";

        if ( count_nr > 0 )
        {
          cur_pos_char = ( hash_map[ coords_cur ] ?? TILE_NOT_GRID );
        }

        debug_map[ coords_cur] = cur_pos_char;

            if ( cur_pos_char == TILE_VERTICAL_PIPE_NORTH_AND_SOUTH ) { coords_1 =  "R" + ( row_cur - 1 ) + "C" + col_cur; coords_2 = "R" + ( row_cur + 1 ) + "C" + col_cur; }

        else if ( cur_pos_char == TILE_90_DEGREE_SOUTH_AND_EAST      ) { coords_1 =  "R" + ( row_cur + 1 ) + "C" + col_cur; coords_2 = "R" + row_cur + "C" +  ( col_cur + 1 ); }
        else if ( cur_pos_char == TILE_90_DEGREE_SOUTH_AND_WEST      ) { coords_1 =  "R" + ( row_cur + 1 ) + "C" + col_cur; coords_2 = "R" + row_cur + "C" +  ( col_cur - 1 ); }

        else if ( cur_pos_char == TILE_90_DEGREE_NORTH_AND_EAST      ) { coords_1 =  "R" + ( row_cur - 1 ) + "C" + col_cur; coords_2 = "R" + row_cur + "C" +  ( col_cur + 1 ); }
        else if ( cur_pos_char == TILE_90_DEGREE_NORTH_AND_WEST      ) { coords_1 =  "R" + ( row_cur - 1 ) + "C" + col_cur; coords_2 = "R" + row_cur + "C" +  ( col_cur - 1 ); }
        else if ( cur_pos_char == TILE_HORIZONTAL_PIPE_EAST_AND_WEST ) { coords_1 =  "R" + row_cur  + "C" +  ( col_cur + 1 ); coords_2 = "R" + row_cur + "C" +  ( col_cur - 1 ); }

        if ( coords_from === coords_1 ) 
        { 
            coords_to = coords_2; 
        }
        else 
        { 
            coords_to = coords_1; 
        }

        console.log( pad( count_nr, 5 ) + "  " + coords_1 + "  " + coords_2 + " - from " + coords_from + " to " + coords_to + "  cur_pos_char " + cur_pos_char );

        coords_from = coords_cur;

        coords_cur = coords_to;

        count_nr++;
    }


    result_part_01 = ( count_nr / 2);

    if ( pKnzDebug )
    {
        console.log( "" );
        console.log( getDebugMap( debug_map, grid_rows, grid_cols ));
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day10_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei(): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray0(): string[] 
{
    const array_test: string[] = [];

    let knz_test_nr : number = 4;

    if ( knz_test_nr == 0 )
    {
        array_test.push( "....." );
        array_test.push( ".S-.." );
        array_test.push( ".|..." );
        array_test.push( "....." );
    }
    else if ( knz_test_nr == 1 )
    {
        array_test.push( "......" );
        array_test.push( ".-S..." );
        array_test.push( "..|..." );
        array_test.push( "......" );
    }
    else if ( knz_test_nr == 2 )
    {
        array_test.push( "..|..." );
        array_test.push( "..S.o." );
        array_test.push( "..|.y." );
        array_test.push( "....y." );
    }
    else if ( knz_test_nr == 3 )
    {
        array_test.push( "......" );
        array_test.push( "..|..." );
        array_test.push( ".-S..." );
        array_test.push( "......" );
    }
    else if ( knz_test_nr == 4 )
    {
        array_test.push( "......" );
        array_test.push( "..|..." );
        array_test.push( "..S-.." );
        array_test.push( "......" );
    }

    return array_test;
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "....." );
    array_test.push( ".S-7." );
    array_test.push( ".|.|." );
    array_test.push( ".L-J." );
    array_test.push( "....." );

    return array_test;
}


function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "7-F7-" );
    array_test.push( ".FJ|7" );
    array_test.push( "SJLL7" );
    array_test.push( "|F--J" );
    array_test.push( "LJ.LJ" );

    return array_test;
}


console.log( "Day 10: Pipe Maze" );

calcArray( getTestArray2() );

//checkReaddatei();
