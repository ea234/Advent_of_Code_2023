import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/14
 * 
 * 
 * ------------------------------------------------------------------
 * 
 */

type PropertieMap = Record< string, string >;

const CHAR_MAP_ROUNDED_ROCK: string = "O";
const CHAR_MAP_CUBED_ROCK  : string = "#";
const CHAR_MAP_SPACE       : string = ".";
const CHAR_NOT_MAP         : string = "X";

let file_string   : string = "";
let file_nr       : number = 0;
let file_write_on : boolean = false;

let KNZ_DEBUG : boolean = false;

function wl( pString : string )
{
    console.log( pString );

    if ( file_write_on )
    {
        file_string +="\n" + pString;
    }
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    if ( file_write_on )
    {
        fs.writeFile( pFileName, pFileData, { flag: "w" } );

        console.log( "File " + pFileName + " created!" );
    }
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    str_result += pad( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? CHAR_NOT_MAP;
        }

        str_result += "\n";
    }

    return str_result;
}


function createMapX( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    str_result += "\nfunction getTestArray" + file_nr + "(): string[] ";
    str_result += "\n{";
    str_result += "\n    const array_test: string[] = [];";
    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n    array_test.push( \"";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? CHAR_NOT_MAP;
        }

        str_result += "\" );";
    }

    str_result += "\n  ";
    str_result += "\n    return array_test;";
    str_result += "\n}";
    str_result += "\n";

    return str_result;
}


function toNorth( map_input : PropertieMap, grid_rows : number, grid_cols : number )
{
    for ( let cur_col = 0; cur_col < grid_cols; cur_col++ )
    {
        let row_index_free : number = 0;
        let row_search     : number = 0;

        while ( ( row_index_free < grid_rows ) && ( row_search < grid_rows ) )
        {
            let cur_key_free  : string = "R" + row_index_free  + "C" + cur_col;

            let cur_char_free : string = map_input[ cur_key_free ] ?? CHAR_NOT_MAP;

            if ( cur_char_free === CHAR_MAP_ROUNDED_ROCK )
            {
                // found round rock, on free position 
                // no further action
                //
                // Rock is OK on this position
            }
            else if ( cur_char_free === CHAR_MAP_CUBED_ROCK )
            {
                // found cubed rock
                // no further action
                //
                // Rock cant be moved
            }
            else if ( cur_char_free === CHAR_MAP_SPACE )
            {
                /*
                 * Search next rounded rock one row futher down the line
                 * The algorith
                 */
                row_search = row_index_free + 1;

                let knz_while_loop : boolean = true;


                while ( knz_while_loop ) 
                {
                    let cur_key_search  : string = "R" + row_search  + "C" + cur_col;

                    let cur_char_search : string = map_input[ cur_key_search ] ?? CHAR_NOT_MAP;

                    if ( KNZ_DEBUG )
                    {
                      wl( "Free " + row_index_free + " " + cur_key_free + " " + cur_char_free  + " - Search  " + row_search + "  " + cur_key_search + " " + cur_char_search + " ");
                    }

                    if ( cur_char_search === CHAR_MAP_ROUNDED_ROCK )
                    {
                        map_input[ cur_key_free   ] = CHAR_MAP_ROUNDED_ROCK;
                        map_input[ cur_key_search ] = CHAR_MAP_SPACE;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_MAP_CUBED_ROCK )
                    {
                        row_index_free = row_search;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_NOT_MAP )
                    {
                        row_index_free = row_search;

                        knz_while_loop = false;
                    }
                    else
                    {
                        row_search++;

                        knz_while_loop = ( ( row_index_free < grid_rows ) && ( row_search < grid_rows ) );
                    }
                }
            }

            row_index_free++;
        }
    }
}


function toSouth( map_input : PropertieMap, grid_rows : number, grid_cols : number )
{
    for ( let cur_col = 0; cur_col < grid_cols; cur_col++ )
    {
        let row_index_free : number = grid_rows - 1;
        let row_search     : number = grid_rows - 1;

        while ( ( row_index_free >= 0 ) && ( row_search >= 0 ) )
        {
            let cur_key_free  : string = "R" + row_index_free  + "C" + cur_col;

            let cur_char_free : string = map_input[ cur_key_free ] ?? CHAR_NOT_MAP;

            if ( cur_char_free === CHAR_MAP_ROUNDED_ROCK )
            {
                // found round rock, on free position 
                // no further action
                //
                // Rock is OK on this position
            }
            else if ( cur_char_free === CHAR_MAP_CUBED_ROCK )
            {
                // found cubed rock
                // no further action
                //
                // Rock cant be moved
            }
            else if ( cur_char_free === CHAR_MAP_SPACE )
            {
                row_search = row_index_free - 1;

                let knz_while_loop : boolean = true;


                while ( knz_while_loop ) 
                {
                    let cur_key_search  : string = "R" + row_search  + "C" + cur_col;

                    let cur_char_search : string = map_input[ cur_key_search ] ?? CHAR_NOT_MAP;

                    if ( KNZ_DEBUG )
                    {
                        wl( "Free " + row_index_free + " " + cur_key_free + " " + cur_char_free  + " - Search  " + row_search + "  " + cur_key_search + " " + cur_char_search + " ");
                    }

                    if ( cur_key_search === "R9C0")
                    {
                            wl( getDebugMap( map_input, grid_rows, grid_cols ) );
                    }

                    if ( cur_char_search === CHAR_MAP_ROUNDED_ROCK )
                    {
                        map_input[ cur_key_free   ] = CHAR_MAP_ROUNDED_ROCK;
                        map_input[ cur_key_search ] = CHAR_MAP_SPACE;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_MAP_CUBED_ROCK )
                    {
                        row_index_free = row_search;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_NOT_MAP )
                    {
                        row_index_free = row_search;

                        knz_while_loop = false;
                    }
                    else
                    {
                        row_search--;

                        knz_while_loop = ( ( row_index_free >= 0 ) && ( row_search >= 0 ) );
                    }
                }
            }

            row_index_free--;
        }
    }
}







function toEast( map_input : PropertieMap, grid_rows : number, grid_cols : number )
{
    for ( let cur_row = 0; cur_row < grid_rows; cur_row++ )
    {
        let col_index_free : number = grid_cols - 1;
        let col_search     : number = grid_cols - 1;

        while ( ( col_index_free >= 0 ) && ( col_search >= 0 ) )
        {
            let cur_key_free  : string = "R" + cur_row + "C" + col_index_free;

            let cur_char_free : string = map_input[ cur_key_free ] ?? CHAR_NOT_MAP;

            if ( cur_char_free === CHAR_MAP_ROUNDED_ROCK )
            {
                // found round rock, on free position 
                // no further action
                //
                // Rock is OK on this position
            }
            else if ( cur_char_free === CHAR_MAP_CUBED_ROCK )
            {
                // found cubed rock
                // no further action
                //
                // Rock cant be moved
            }
            else if ( cur_char_free === CHAR_MAP_SPACE )
            {
                col_search = col_index_free - 1;

                let knz_while_loop : boolean = true;


                while ( knz_while_loop ) 
                {
                    let cur_key_search  : string = "R" + cur_row  + "C" + col_search;

                    let cur_char_search : string = map_input[ cur_key_search ] ?? CHAR_NOT_MAP;

                    if ( KNZ_DEBUG )
                    {
                        wl( "Free " + col_index_free + " " + cur_key_free + " " + cur_char_free  + " - Search  " + col_search + "  " + cur_key_search + " " + cur_char_search + " ");
                    }

                    if ( cur_char_search === CHAR_MAP_ROUNDED_ROCK )
                    {
                        map_input[ cur_key_free   ] = CHAR_MAP_ROUNDED_ROCK;
                        map_input[ cur_key_search ] = CHAR_MAP_SPACE;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_MAP_CUBED_ROCK )
                    {
                        col_index_free = col_search;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_NOT_MAP )
                    {
                        col_index_free = col_search;

                        knz_while_loop = false;
                    }
                    else
                    {
                        col_search--;

                        knz_while_loop = ( ( col_index_free >= 0 ) && ( col_search >= 0 ) );
                    }
                }
            }

            col_index_free--;
        }
    }
}







function toWest( map_input : PropertieMap, grid_rows : number, grid_cols : number )
{
    for ( let cur_row = 0; cur_row < grid_rows; cur_row++ )
    {
        let col_index_free : number = 0;
        let col_search     : number = 0;

        while ( ( col_index_free < grid_cols ) && ( col_search < grid_cols ) )
        {
            let cur_key_free  : string = "R" + cur_row + "C" + col_index_free;

            let cur_char_free : string = map_input[ cur_key_free ] ?? CHAR_NOT_MAP;

            if ( cur_char_free === CHAR_MAP_ROUNDED_ROCK )
            {
                // found round rock, on free position 
                // no further action
                //
                // Rock is OK on this position
            }
            else if ( cur_char_free === CHAR_MAP_CUBED_ROCK )
            {
                // found cubed rock
                // no further action
                //
                // Rock cant be moved
            }
            else if ( cur_char_free === CHAR_MAP_SPACE )
            {
                col_search = col_index_free + 1;

                let knz_while_loop : boolean = true;


                while ( knz_while_loop ) 
                {
                    let cur_key_search  : string = "R" + cur_row  + "C" + col_search;

                    let cur_char_search : string = map_input[ cur_key_search ] ?? CHAR_NOT_MAP;

                    if ( KNZ_DEBUG )
                    {
                        wl( "Free " + col_index_free + " " + cur_key_free + " " + cur_char_free  + " - Search  " + col_search + "  " + cur_key_search + " " + cur_char_search + " ");
                    }

                    if ( cur_char_search === CHAR_MAP_ROUNDED_ROCK )
                    {
                        map_input[ cur_key_free   ] = CHAR_MAP_ROUNDED_ROCK;
                        map_input[ cur_key_search ] = CHAR_MAP_SPACE;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_MAP_CUBED_ROCK )
                    {
                        col_index_free = col_search;

                        knz_while_loop = false;
                    }
                    else if ( cur_char_search === CHAR_NOT_MAP )
                    {
                        col_index_free = col_search;

                        knz_while_loop = false;
                    }
                    else
                    {
                        col_search++;

                        knz_while_loop = ( ( col_index_free < grid_cols ) && ( col_search < grid_cols ) );
                    }
                }
            }

            col_index_free++;
        }
    }
}




function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    /*
     * *******************************************************************************************************
     * Initialising the grid
     * *******************************************************************************************************
     */
    let map_input : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str != "")
        {
            for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
            {
                grid_cols = cur_col1;

                let cur_char_input : string = cur_input_str[ grid_cols ] ?? ".";

                let hash_map_key = "R" + grid_rows + "C" + grid_cols;

                map_input[ hash_map_key ] = cur_char_input;
            }

            grid_cols++;
            grid_rows++;
        }
    }

    wl( getDebugMap( map_input, grid_rows, grid_cols ) );

    /*
     * *******************************************************************************************************
     * Roll all to the north
     * *******************************************************************************************************
     */

    const start_date = new Date();

    let nr_togo = 0;

    toNorth( map_input, grid_rows, grid_cols );

    /*
     * Test Part 2 the hard way ... not suitable
     */
    // for ( let iteration_nr = 0; iteration_nr < 1_000_000_000; iteration_nr++)
    // for ( let iteration_nr = 0; iteration_nr < 40_000; iteration_nr++)
    // {
    //     const now = new Date();
    //     console.log( "Iteration Nr " + iteration_nr + " " + now.toISOString() );
    //
    //     toNorth( map_input, grid_rows, grid_cols );
    //     toWest( map_input, grid_rows, grid_cols );
    //     toSouth( map_input, grid_rows, grid_cols );
    //     toEast( map_input, grid_rows, grid_cols );
    // }

    console.log( "start " + start_date.toISOString() );

    /*
     * *******************************************************************************************************
     * Calculating the Result-Value
     * *******************************************************************************************************
     */

    for ( let cur_row = 0; cur_row < grid_rows; cur_row++ )
    {
        let debug_weight_of_row : number = 0;

        let debug_str : string = "";

        for ( let cur_col = 0; cur_col < grid_cols; cur_col++ )
        {
            let cur_key_input  : string = "R" + cur_row  + "C" + cur_col;

            let cur_char_input : string = map_input[ cur_key_input ] ?? CHAR_NOT_MAP;

            debug_str += cur_char_input;

            if ( cur_char_input === CHAR_MAP_ROUNDED_ROCK )
            {
                let cur_weight_rock = grid_rows - cur_row;

                result_part_01 += cur_weight_rock;

                debug_weight_of_row += cur_weight_rock;
            }
        }

        wl( pad( "" + cur_row, 4 ) + "  " + debug_str + " " + pad( "" + debug_weight_of_row, 8 ));
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day14_input.txt";

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

        calcArray( arrFromFile, true );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "O....#...." );
    array_test.push( "O.OO#....#" );
    array_test.push( ".....##..." );
    array_test.push( "OO.#O....O" );
    array_test.push( ".O.....O#." );
    array_test.push( "O.#..O.#.#" );
    array_test.push( "..O..#O..O" );
    array_test.push( ".......O.." );
    array_test.push( "#....###.." );
    array_test.push( "#OO..#...." );


    // array_test.push( "OOOO.#.O.." );
    // array_test.push( "OO..#....#" );
    // array_test.push( "OO..O##..O" );
    // array_test.push( "O..#.OO..." );
    // array_test.push( "........#." );
    // array_test.push( "..#....#.#" );
    // array_test.push( "..O..#.O.O" );
    // array_test.push( "..O......." );
    // array_test.push( "#....###.." );
    // array_test.push( "#....#...." );

    return array_test;
}


wl( "Day 14 - Parabolic Reflector Dish" );

calcArray( getTestArray1() );

/*
*/

//checkReaddatei();
 