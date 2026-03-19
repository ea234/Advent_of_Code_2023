import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/13
 * 
 * 
 *      012345678
 *   0  #.##..##.
 *   1  ..#.##.#.
 *   2  ##......#
 *   3  ##......#
 *   4  ..#.##.#.
 *   5  ..##..##.
 *   6  #.#.##.#.
 * 
 * Row Nr    1  Index    0  Hash   180  Diff     0
 * Row Nr    2  Index    1  Hash   180  Diff    90
 * Row Nr    3  Index    2  Hash    90  Diff     0
 * Row Nr    4  Index    3  Hash    90  Diff   -90
 * Row Nr    5  Index    4  Hash   180  Diff     0
 * Row Nr    6  Index    5  Hash   180  Diff     0
 * Row Nr    7  Index    6  Hash   180  Diff   180
 * 
 * Col Nr    1  Index    0  Hash   110  Diff    60
 * Col Nr    2  Index    1  Hash    50  Diff  -110
 * Col Nr    3  Index    2  Hash   160  Diff   110
 * Col Nr    4  Index    3  Hash    50  Diff   -60
 * Col Nr    5  Index    4  Hash   110  Diff     0
 * Col Nr    6  Index    5  Hash   110  Diff    60
 * Col Nr    7  Index    6  Hash    50  Diff  -110
 * Col Nr    8  Index    7  Hash   160  Diff   110
 * Col Nr    9  Index    8  Hash    50  Diff    50
 * 
 * 
 * Row Index   0 Steps   1   Max Index   0 Steps   1
 * Row Index   2 Steps   3   Max Index   2 Steps   3
 * Row Index   4 Steps   1   Max Index   2 Steps   3
 * Row Index   5 Steps   1   Max Index   2 Steps   3
 * Col Index   4 Steps   4   Max Index   4 Steps   4
 * 
 * Ergebnis Index 4 Step 4
 * 
 * 
 * result_x = 5
 * 
 * ------------------------------------------------------------------
 * 
 *      012345678
 *   0  #...##..#
 *   1  #....#..#
 *   2  ..##..###
 *   3  #####.##.
 *   4  #####.##.
 *   5  ..##..###
 *   6  #....#..#
 * 
 * Row Nr    1  Index    0  Hash   170  Diff    40
 * Row Nr    2  Index    1  Hash   130  Diff  -130
 * Row Nr    3  Index    2  Hash   260  Diff    30
 * Row Nr    4  Index    3  Hash   230  Diff     0
 * Row Nr    5  Index    4  Hash   230  Diff   -30
 * Row Nr    6  Index    5  Hash   260  Diff   130
 * Row Nr    7  Index    6  Hash   130  Diff   130
 * 
 * Col Nr    1  Index    0  Hash   140  Diff    70
 * Col Nr    2  Index    1  Hash    70  Diff   -70
 * Col Nr    3  Index    2  Hash   140  Diff     0
 * Col Nr    4  Index    3  Hash   140  Diff    70
 * Col Nr    5  Index    4  Hash    70  Diff     0
 * Col Nr    6  Index    5  Hash    70  Diff   -70
 * Col Nr    7  Index    6  Hash   140  Diff     0
 * Col Nr    8  Index    7  Hash   140  Diff     0
 * Col Nr    9  Index    8  Hash   140  Diff   140
 * 
 * 
 * Row Index   3 Steps   3   Max Index   3 Steps   3
 * Col Index   2 Steps   2   Max Index   3 Steps   3
 * Col Index   4 Steps   3   Max Index   4 Steps   3
 * Col Index   6 Steps   1   Max Index   4 Steps   3
 * Col Index   7 Steps   1   Max Index   4 Steps   3
 * 
 * Ergebnis Index 3 Step 3
 * 
 * 
 * result_x = 400
 * 
 * ------------------------------------------------------------------
 * 
 *      012345678901234
 *   0  ###############
 *   1  .....#.####.#..
 *   2  .....#.####.#..
 *   3  ##############.
 *   4  #############..
 *   5  #####.##.####..
 *   6  ######.###.#..#
 *   7  .....#.####.#..
 *   8  .....#.####.#..
 *   9  ######.###.##.#
 *  10  .###..#.#....##
 *  11  .###..#.#....##
 *  12  ######.###.##.#
 *  13  .....#.####.#..
 *  14  .....#.####.#..
 *  15  ######.###.#..#
 *  16  ############...
 *  17  ###########....
 * 
 * Row Nr    1  Index    0  Hash  1050  Diff   540
 * Row Nr    2  Index    1  Hash   510  Diff     0
 * Row Nr    3  Index    2  Hash   510  Diff  -400
 * Row Nr    4  Index    3  Hash   910  Diff   130
 * Row Nr    5  Index    4  Hash   780  Diff   130
 * Row Nr    6  Index    5  Hash   650  Diff    10
 * Row Nr    7  Index    6  Hash   640  Diff   130
 * Row Nr    8  Index    7  Hash   510  Diff     0
 * Row Nr    9  Index    8  Hash   510  Diff  -250
 * Row Nr   10  Index    9  Hash   760  Diff   290
 * Row Nr   11  Index   10  Hash   470  Diff     0
 * Row Nr   12  Index   11  Hash   470  Diff  -290
 * Row Nr   13  Index   12  Hash   760  Diff   250
 * Row Nr   14  Index   13  Hash   510  Diff     0
 * Row Nr   15  Index   14  Hash   510  Diff  -130
 * Row Nr   16  Index   15  Hash   640  Diff   -20
 * Row Nr   17  Index   16  Hash   660  Diff   110
 * Row Nr   18  Index   17  Hash   550  Diff   550
 * 
 * Col Nr    1  Index    0  Hash   390  Diff  -210
 * Col Nr    2  Index    1  Hash   600  Diff     0
 * Col Nr    3  Index    2  Hash   600  Diff     0
 * Col Nr    4  Index    3  Hash   600  Diff   210
 * Col Nr    5  Index    4  Hash   390  Diff  -400
 * Col Nr    6  Index    5  Hash   790  Diff   460
 * Col Nr    7  Index    6  Hash   330  Diff  -510
 * Col Nr    8  Index    7  Hash   840  Diff  -160
 * Col Nr    9  Index    8  Hash  1000  Diff   160
 * Col Nr   10  Index    9  Hash   840  Diff   270
 * Col Nr   11  Index   10  Hash   570  Diff   180
 * Col Nr   12  Index   11  Hash   390  Diff  -390
 * Col Nr   13  Index   12  Hash   780  Diff   540
 * Col Nr   14  Index   13  Hash   240  Diff  -240
 * Col Nr   15  Index   14  Hash   480  Diff   480
 * 
 * 
 * Row Index   1 Steps   1   Max Index   1 Steps   1
 * Row Index   7 Steps   1   Max Index   1 Steps   1
 * Row Index  10 Steps   5   Max Index  10 Steps   5
 * Row Index  13 Steps   1   Max Index  10 Steps   5
 * Col Index   1 Steps   1   Max Index  10 Steps   5
 * Col Index   2 Steps   1   Max Index  10 Steps   5
 * 
 * Ergebnis Index 10 Step 5
 * 
 * 
 * result_x = 1100
 * 
 */

type PropertieMap = Record< string, string >;

const CHAR_MAP_MIRROR : string = "#";
const CHAR_MAP_LAVA   : string = ".";
const CHAR_NOT_MAP    : string = "X";

let file_string   : string = "";
let file_nr       : number = 0;
let file_write_on : boolean = false;

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


function calcRowHash( pMap : PropertieMap, pMapCols : number, pRow1 : number ) : number 
{
    let hash_wert = 0;

    for ( let col_index = 0; col_index < pMapCols; col_index++ )
    {
        if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += ( col_index * 10 )
        }
        // else if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_LAVA )
        // {
        //     hash_wert += ( col_index * 2 )
        // }
    }

    return hash_wert;
}


function calcColHash( pMap : PropertieMap, pMapRows : number, pCol : number ) : number 
{
    let hash_wert = 0;

    for ( let row_index = 0; row_index < pMapRows; row_index++ )
    {
        if ( ( pMap[ "R" + row_index + "C" + pCol ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += ( row_index * 10 )
        }
        // else if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_LAVA )
        // {
        //     hash_wert += ( col_index * 2 )
        // }
    }

    return hash_wert;
}


function getMirrorSteps( pVektor : number[], pStartIndex : number ): number
{
    let step_count : number = 0;

    let index_a = pStartIndex;
    let index_b = pStartIndex + 1;

    while ( ( index_a >= 0 ) && ( index_b < pVektor.length ) && ( pVektor[ index_a ] === pVektor[ index_b ]) )
    {
        index_a--;

        index_b++;

        step_count++;
    }

    return step_count;
}


function checkGrid( pMap : PropertieMap, pMapRows : number, pMapCols : number, pKnzDebug : boolean ) : number
{
    file_string = "";

    if ( pKnzDebug )
    {
        wl( getDebugMap(  pMap, pMapRows, pMapCols ) );
    }

    /*
     * *******************************************************************************************************
     * Calculating Hash-Values for Rows and Columns
     * *******************************************************************************************************
     */
    let hash_vektor_row : number[] = [];
    let hash_vektor_col : number[] = [];

    for ( let row_n : number = 0; row_n < pMapRows; row_n++ )
    {
        hash_vektor_row[ row_n ] = calcRowHash( pMap, pMapCols, row_n );
    }

    for ( let col_n : number = 0; col_n < pMapCols; col_n++ )
    {
        hash_vektor_col[ col_n ] = calcColHash( pMap, pMapCols, col_n );
    }

    /*
     * *******************************************************************************************************
     * Calculating difference Vektors for Rows and Columns
     * *******************************************************************************************************
     */
    let diff_row  : number[] = [ ...hash_vektor_row ];
    let diff_col  : number[] = [ ...hash_vektor_col ];

    for ( let index_b : number = 0; index_b < ( hash_vektor_row.length - 1 ); index_b++ )
    {
        diff_row[ index_b ] = hash_vektor_row[ index_b ]! - hash_vektor_row[ index_b + 1 ]!;
    }

    for ( let index_b : number = 0; index_b < ( hash_vektor_col.length - 1 ); index_b++ )
    {
        diff_col[ index_b ] = hash_vektor_col[ index_b ]! - hash_vektor_col[ index_b + 1 ]!;
    }

    /*
     * *******************************************************************************************************
     * Writing Debug-Info 
     * *******************************************************************************************************
     */

    if ( pKnzDebug )
    {
        for ( let row_n : number = 0; row_n < pMapRows; row_n++ )
        {
            wl( "Row Nr " + pad( ( row_n + 1 ), 4 ) + "  Index " + pad( row_n, 4 ) + "  Hash " + pad( "" + hash_vektor_row[ row_n ], 5 ) + "  Diff " + pad( "" + diff_row[ row_n ], 5 ) );
        }

        wl( "" );

        for ( let col_n : number = 0; col_n < pMapCols; col_n++ )
        {
            wl( "Col Nr " + pad( ( col_n + 1 ), 4 ) + "  Index " + pad( col_n, 4 ) + "  Hash " + pad( "" + hash_vektor_col[ col_n ], 5 ) + "  Diff " + pad( "" + diff_col[ col_n ], 5 ) );
        }

        wl( "" );
        wl( "" );
    }

    /*
     * *******************************************************************************************************
     * For every 0 difference, calculate the steps in the mirrord hash-values (Rows)
     * *******************************************************************************************************
     */
    let max_total_step_count    : number = 0;
    let max_total_start_index_0 : number = -1;
    let max_start_index_0       : number = -1;
    let max_step_count          : number = 0;
    let cur_step_count          : number = 0;

    for ( let index_b : number = 0; index_b < ( hash_vektor_row.length - 1 ); index_b++ )
    {
        if ( diff_row[ index_b ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_row, index_b );

            if ( cur_step_count > max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_b;
            }

            wl( "Row Index " + pad( index_b, 3 ) + " Steps " + pad( cur_step_count, 3 ) + "   Max Index " + pad( max_start_index_0, 3 )  + " Steps " + pad( max_step_count, 3 )  );
        }
    }

    if ( max_step_count > max_total_step_count )
    {
        max_total_step_count = max_step_count;
        max_total_start_index_0 = max_start_index_0;
    }
    
    /*
     * *******************************************************************************************************
     * For every 0 difference, calculate the steps in the mirrord hash-values (Columns)
     * *******************************************************************************************************
     */
    for ( let index_b : number = 0; index_b < ( hash_vektor_col.length - 1 ); index_b++ )
    {
        if ( diff_col[ index_b ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_col, index_b );

            if ( cur_step_count >= max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_b;
            }

            wl( "Col Index " + pad( index_b, 3 )  + " Steps " + pad( cur_step_count, 3 ) + "   Max Index " + pad( max_start_index_0, 3 )  + " Steps " + pad( max_step_count, 3 )  );
        }
    }

    /*
     * *******************************************************************************************************
     * Determine, wether the Map is mirrored horizontal or vertical
     * *******************************************************************************************************
     */
    let knz_mirror_col : boolean = false;

    if ( max_step_count > max_total_step_count )
    {
        max_total_step_count = max_step_count;
        max_total_start_index_0 = max_start_index_0;

        knz_mirror_col = true;
    }

    /*
     * *******************************************************************************************************
     * Calculating the Result-Value
     * *******************************************************************************************************
     */
    let result_x : number = 0;

    if ( max_total_step_count > 1 )
    {
        wl( "" );
        wl( "Ergebnis Index " + max_total_start_index_0  + " Step " + max_total_step_count );
        wl( "" );

        if ( knz_mirror_col )
        {
            result_x = max_total_start_index_0 + 1;
        }
        else
        {
            result_x = ( max_total_start_index_0 + 1 ) * 100;
        }
    }

    if ( pKnzDebug )
    {
        file_nr++;

        wl( "" );
        wl( "result_x = " + result_x );
        wl( "" );
        wl( createMapX( pMap, pMapRows, pMapCols ) );
        wl( "" );
        wl( "" );

        writeFile( "/home/ea234/typescript/temp_day13/testfall_" + file_nr + ".txt", file_string );
    }

    file_string = "";

    return result_x;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    let map_input : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str == "")
        {
            result_part_01 += checkGrid( map_input, grid_rows, grid_cols, pKnzDebug );

            map_input = {};
            grid_cols = 0;
            grid_rows = 0;
        }
        else
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

    if ( grid_rows > 0 )
    {
        result_part_01 += checkGrid( map_input, grid_rows, grid_cols, pKnzDebug );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day13_input.txt";

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

    array_test.push( "#.##..##." );
    array_test.push( "..#.##.#." );
    array_test.push( "##......#" );
    array_test.push( "##......#" );
    array_test.push( "..#.##.#." );
    array_test.push( "..##..##." );
    array_test.push( "#.#.##.#." );

    array_test.push( "" );

    array_test.push( "#...##..#" );
    array_test.push( "#....#..#" );
    array_test.push( "..##..###" );
    array_test.push( "#####.##." );
    array_test.push( "#####.##." );
    array_test.push( "..##..###" );
    array_test.push( "#....#..#" );

    return array_test;
}


function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "###############" );
    array_test.push( ".....#.####.#.." ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( "##############." );
    array_test.push( "#############.." );
    array_test.push( "#####.##.####.." );
    //
    array_test.push( "######.###.#..#" ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( ".....#.####.#.." ); 
    array_test.push( "######.###.##.#" ); 
    array_test.push( ".###..#.#....##" ); 
    // 
    array_test.push( ".###..#.#....##" );
    array_test.push( "######.###.##.#" );
    array_test.push( ".....#.####.#.." );
    array_test.push( ".....#.####.#.." );
    array_test.push( "######.###.#..#" );
    //
    array_test.push( "############..." );
    array_test.push( "###########...." );

    return array_test;
}


wl( "Day 13 - Point of Incidence" );

calcArray( getTestArray2());

/*
1111 = tl
35159 = to hi
28244 = to hi
*/

//checkReaddatei();
 