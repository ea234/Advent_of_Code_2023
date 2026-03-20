import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/13
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
 * Row Nr    1  Index    0  Hash      358  Diff      268  #.##..##.
 * Row Nr    2  Index    1  Hash       90  Diff     -295  ..#.##.#.
 * Row Nr    3  Index    2  Hash      385  Diff        0  ##......#
 * Row Nr    4  Index    3  Hash      385  Diff      295  ##......#
 * Row Nr    5  Index    4  Hash       90  Diff      -12  ..#.##.#.
 * Row Nr    6  Index    5  Hash      102  Diff     -244  ..##..##.
 * Row Nr    7  Index    6  Hash      346  Diff      346  #.#.##.#.
 * 
 * Col Nr    1  Index    0  Hash       77  Diff       65  #.##..#
 * Col Nr    2  Index    1  Hash       12  Diff     -103  ..##...
 * Col Nr    3  Index    2  Hash      115  Diff       82  ##..###
 * Col Nr    4  Index    3  Hash       33  Diff      -49  #....#.
 * Col Nr    5  Index    4  Hash       82  Diff        0  .#..#.#
 * Col Nr    6  Index    5  Hash       82  Diff       49  .#..#.#
 * Col Nr    7  Index    6  Hash       33  Diff      -82  #....#.
 * Col Nr    8  Index    7  Hash      115  Diff      103  ##..###
 * Col Nr    9  Index    8  Hash       12  Diff       12  ..##...
 * 
 * 
 * Row Index   2 Steps   2   Max Index   2 Steps   2
 * Col Index   4 Steps   4   Max Index   4 Steps   4
 * 
 * Ergebnis Index 4 Step 4
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
 * Row Nr    1  Index    0  Hash      281  Diff       16  #...##..#
 * Row Nr    2  Index    1  Hash      265  Diff      162  #....#..#
 * Row Nr    3  Index    2  Hash      103  Diff     -399  ..##..###
 * Row Nr    4  Index    3  Hash      502  Diff        0  #####.##.
 * Row Nr    5  Index    4  Hash      502  Diff      399  #####.##.
 * Row Nr    6  Index    5  Hash      103  Diff     -162  ..##..###
 * Row Nr    7  Index    6  Hash      265  Diff      265  #....#..#
 * 
 * Col Nr    1  Index    0  Hash       91  Diff       67  ##.##.#
 * Col Nr    2  Index    1  Hash       24  Diff      -36  ...##..
 * Col Nr    3  Index    2  Hash       60  Diff        0  ..####.
 * Col Nr    4  Index    3  Hash       60  Diff       35  ..####.
 * Col Nr    5  Index    4  Hash       25  Diff      -42  #..##..
 * Col Nr    6  Index    5  Hash       67  Diff        7  ##....#
 * Col Nr    7  Index    6  Hash       60  Diff        0  ..####.
 * Col Nr    8  Index    7  Hash       60  Diff      -43  ..####.
 * Col Nr    9  Index    8  Hash      103  Diff      103  ###..##
 * 
 * 
 * Row Index   3 Steps   3   Max Index   3 Steps   3
 * Col Index   2 Steps   1   Max Index   2 Steps   1
 * Col Index   6 Steps   1   Max Index   2 Steps   1
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
 * Row Nr    1  Index    0  Hash    32767  Diff    32011  ###############
 * Row Nr    2  Index    1  Hash      756  Diff        0  .....#.####.#..
 * Row Nr    3  Index    2  Hash      756  Diff   -32010  .....#.####.#..
 * Row Nr    4  Index    3  Hash    32766  Diff        2  ##############.
 * Row Nr    5  Index    4  Hash    32764  Diff      576  #############..
 * Row Nr    6  Index    5  Hash    32188  Diff     -301  #####.##.####..
 * Row Nr    7  Index    6  Hash    32489  Diff    31733  ######.###.#..#
 * Row Nr    8  Index    7  Hash      756  Diff        0  .....#.####.#..
 * Row Nr    9  Index    8  Hash      756  Diff   -31737  .....#.####.#..
 * Row Nr   10  Index    9  Hash    32493  Diff    17834  ######.###.##.#
 * Row Nr   11  Index   10  Hash    14659  Diff        0  .###..#.#....##
 * Row Nr   12  Index   11  Hash    14659  Diff   -17834  .###..#.#....##
 * Row Nr   13  Index   12  Hash    32493  Diff    31737  ######.###.##.#
 * Row Nr   14  Index   13  Hash      756  Diff        0  .....#.####.#..
 * Row Nr   15  Index   14  Hash      756  Diff   -31733  .....#.####.#..
 * Row Nr   16  Index   15  Hash    32489  Diff     -271  ######.###.#..#
 * Row Nr   17  Index   16  Hash    32760  Diff        8  ############...
 * Row Nr   18  Index   17  Hash    32752  Diff    32752  ###########....
 * 
 * Col Nr    1  Index    0  Hash   234105  Diff    -3072  #..####..#..#..###
 * Col Nr    2  Index    1  Hash   237177  Diff        0  #..####..####..###
 * Col Nr    3  Index    2  Hash   237177  Diff        0  #..####..####..###
 * Col Nr    4  Index    3  Hash   237177  Diff     3072  #..####..####..###
 * Col Nr    5  Index    4  Hash   234105  Diff   -24934  #..####..#..#..###
 * Col Nr    6  Index    5  Hash   259039  Diff    59302  #####.####..######
 * Col Nr    7  Index    6  Hash   199737  Diff   -59334  #..###....##....##
 * Col Nr    8  Index    7  Hash   259071  Diff    -3040  ##########..######
 * Col Nr    9  Index    8  Hash   262111  Diff     3040  #####.############
 * Col Nr   10  Index    9  Hash   259071  Diff    37440  ##########..######
 * Col Nr   11  Index   10  Hash   221631  Diff   118598  ######.##....##.##
 * Col Nr   12  Index   11  Hash   103033  Diff    73402  #..####..#..#..##.
 * Col Nr   13  Index   12  Hash    29631  Diff    26550  ######.###..###...
 * Col Nr   14  Index   13  Hash     3081  Diff   -37432  #..#......##......
 * Col Nr   15  Index   14  Hash    40513  Diff    40513  #.....#..####..#..
 * 
 * 
 * Row Index   1 Steps   1   Max Index   1 Steps   1
 * Row Index   7 Steps   1   Max Index   1 Steps   1
 * Row Index  10 Steps   5   Max Index  10 Steps   5
 * Row Index  13 Steps   1   Max Index  10 Steps   5
 * Col Index   1 Steps   1   Max Index   1 Steps   1
 * Col Index   2 Steps   1   Max Index   1 Steps   1
 * 
 * Ergebnis Index 10 Step 5
 * 
 * 
 * result_x = 1100
 * 
 * ------------------------------------------------------------------
 * 
 *      01234567890
 *   0  .....#..#.#
 *   1  .....#..#.#
 *   2  ..#.##...##
 *   3  ....##.###.
 *   4  #..#....#..
 *   5  ..#.#.##.#.
 *   6  #####.....#
 *   7  #..#..#####
 *   8  .###.......
 *   9  .###.......
 *  10  #..#..#####
 *  11  #####.....#
 *  12  ..#.#.##.#.
 *  13  #..#....#..
 *  14  ....##.###.
 *  15  ..#.##...##
 *  16  .....#..#.#
 * 
 * Row Nr    1  Index    0  Hash       37  Diff        0  .....#..#.#
 * Row Nr    2  Index    1  Hash       37  Diff     -318  .....#..#.#
 * Row Nr    3  Index    2  Hash      355  Diff      245  ..#.##...##
 * Row Nr    4  Index    3  Hash      110  Diff    -1046  ....##.###.
 * Row Nr    5  Index    4  Hash     1156  Diff      810  #..#....#..
 * Row Nr    6  Index    5  Hash      346  Diff    -1639  ..#.#.##.#.
 * Row Nr    7  Index    6  Hash     1985  Diff      802  #####.....#
 * Row Nr    8  Index    7  Hash     1183  Diff      287  #..#..#####
 * Row Nr    9  Index    8  Hash      896  Diff        0  .###.......
 * Row Nr   10  Index    9  Hash      896  Diff     -287  .###.......
 * Row Nr   11  Index   10  Hash     1183  Diff     -802  #..#..#####
 * Row Nr   12  Index   11  Hash     1985  Diff     1639  #####.....#
 * Row Nr   13  Index   12  Hash      346  Diff     -810  ..#.#.##.#.
 * Row Nr   14  Index   13  Hash     1156  Diff     1046  #..#....#..
 * Row Nr   15  Index   14  Hash      110  Diff     -245  ....##.###.
 * Row Nr   16  Index   15  Hash      355  Diff      318  ..#.##...##
 * Row Nr   17  Index   16  Hash       37  Diff       37  .....#..#.#
 * 
 * Col Nr    1  Index    0  Hash    11472  Diff     8592  ....#.##..##.#...
 * Col Nr    2  Index    1  Hash     2880  Diff   -36900  ......#.##.#.....
 * Col Nr    3  Index    2  Hash    39780  Diff    27540  ..#..##.##.##..#.
 * Col Nr    4  Index    3  Hash    12240  Diff   -43164  ....#.######.#...
 * Col Nr    5  Index    4  Hash    55404  Diff   -59299  ..##.##....##.##.
 * Col Nr    6  Index    5  Hash   114703  Diff   109423  ####..........###
 * Col Nr    7  Index    6  Hash     5280  Diff   -16392  .....#.#..#.#....
 * Col Nr    8  Index    7  Hash    21672  Diff   -69619  ...#.#.#..#.#.#..
 * Col Nr    9  Index    8  Hash    91291  Diff    36847  ##.##..#..#..##.#
 * Col Nr   10  Index    9  Hash    54444  Diff   -47131  ..##.#.#..#.#.##.
 * Col Nr   11  Index   10  Hash   101575  Diff   101575  ###...##..##...##
 * 
 * 
 * Row Index   0 Steps   1   Max Index   0 Steps   1
 * Row Index   8 Steps   8   Max Index   8 Steps   8
 * 
 * Ergebnis Index 8 Step 8
 * 
 * 
 * result_x = 900
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


function getDebugRow( pMap : PropertieMap, pMapCols : number, pRow : number ) : string 
{
    let hash_wert : string = "";

    for ( let col_index = 0; col_index < pMapCols; col_index++ )
    {
        hash_wert += ( pMap[ "R" + pRow + "C" + col_index ] ?? CHAR_NOT_MAP )
    }

    return hash_wert;
}


function getDebugCol( pMap : PropertieMap, pMapRows : number, pCol : number ) : string 
{
    let hash_wert : string = "";

    for ( let row_index = 0; row_index < pMapRows; row_index++ )
    {
        hash_wert += ( pMap[ "R" + row_index + "C" + pCol ] ?? CHAR_NOT_MAP )
    }

    return hash_wert;
}


function calcHashValueBinFromRow( pMap : PropertieMap, pMapCols : number, pRow1 : number ) : number 
{
    let hash_wert = 1; // return value must not be 0

    let bin_val : number = 2;

    for ( let col_index = pMapCols - 1; col_index >= 0 ; col_index-- )
    {
        if ( ( pMap[ "R" + pRow1 + "C" + col_index ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += bin_val;
        }

        bin_val = bin_val * 2;
    }

    return hash_wert;
}


function calcHashValueBinFromCol( pMap : PropertieMap, pMapRows : number, pCol : number ) : number 
{
    let hash_wert = 1; // return value must not be 0

    let bin_val : number = 2;

    for ( let row_index = 0; row_index < pMapRows; row_index++ )
    {
        if ( ( pMap[ "R" + row_index + "C" + pCol ] ?? CHAR_NOT_MAP ) === CHAR_MAP_MIRROR )
        {
            hash_wert += bin_val;
        }

        bin_val = bin_val * 2;
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
     * Assuming the Input-Data is binary, the hash-value is the decimal value.
     * *******************************************************************************************************
     */
    let hash_vektor_row : number[] = [];
    let hash_vektor_col : number[] = [];

    for ( let row_n : number = 0; row_n < pMapRows; row_n++ )
    {
        hash_vektor_row[ row_n ] = calcHashValueBinFromRow( pMap, pMapCols, row_n );
    }

    for ( let col_n : number = 0; col_n < pMapCols; col_n++ )
    {
        hash_vektor_col[ col_n ] = calcHashValueBinFromCol( pMap, pMapRows, col_n );
    }

    /*
     * *******************************************************************************************************
     * Calculating difference Vektors for Rows and Columns
     * Two identical consecutive values ​​equal 0. This is the starting point for finding the reflections.
     * *******************************************************************************************************
     */
    let diff_row  : number[] = [ ...hash_vektor_row ];
    let diff_col  : number[] = [ ...hash_vektor_col ];

    for ( let index_b : number = 0; index_b < ( hash_vektor_row.length -1 ); index_b++ )
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
            wl( "Row Nr " + pad( ( row_n + 1 ), 4 ) + "  Index " + pad( row_n, 4 ) + "  Hash " + pad( "" + hash_vektor_row[ row_n ], 8 ) + "  Diff " + pad( "" + diff_row[ row_n ], 8 ) + "  " + getDebugRow( pMap, pMapCols, row_n ) );
        }

        wl( "" );

        for ( let col_n : number = 0; col_n < pMapCols; col_n++ )
        {
            wl( "Col Nr " + pad( ( col_n + 1 ), 4 ) + "  Index " + pad( col_n, 4 ) + "  Hash " + pad( "" + hash_vektor_col[ col_n ], 8 ) + "  Diff " + pad( "" + diff_col[ col_n ], 8 ) + "  " + getDebugCol( pMap, pMapRows, col_n ) );
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

    for ( let index_row : number = 0; index_row < ( hash_vektor_row.length - 1 ); index_row++ )
    {
        if ( diff_row[ index_row ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_row, index_row );

            if ( cur_step_count > max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_row;
            }

            wl( "Row Index " + pad( index_row, 3 ) + " Steps " + pad( cur_step_count, 3 ) + "   Max Index " + pad( max_start_index_0, 3 )  + " Steps " + pad( max_step_count, 3 )  );
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

    max_step_count = 0;

    for ( let index_col : number = 0; index_col < ( hash_vektor_col.length - 1 ); index_col++ )
    {
        if ( diff_col[ index_col ] === 0 ) 
        {
           cur_step_count = getMirrorSteps( hash_vektor_col, index_col );

            if ( cur_step_count > max_step_count )
            {
                max_step_count = cur_step_count;

                max_start_index_0 = index_col;
            }

            wl( "Col Index " + pad( index_col, 3 )  + " Steps " + pad( cur_step_count, 3 ) + "   Max Index " + pad( max_start_index_0, 3 )  + " Steps " + pad( max_step_count, 3 )  );
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
    else if ( max_step_count == max_total_step_count ) 
    {
        if ( max_start_index_0 < max_total_start_index_0 )
        {
            max_total_step_count = max_step_count;
            max_total_start_index_0 = max_start_index_0;

            knz_mirror_col = true;
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating the Result-Value
     * *******************************************************************************************************
     */
    let result_x : number = 0;

    if ( max_total_step_count > 0 )
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


function getTestArray3(): string[] 
{
    const array_test: string[] = [];

    array_test.push( ".....#..#.#" );
    array_test.push( ".....#..#.#" );
    array_test.push( "..#.##...##" );
    array_test.push( "....##.###." );
    array_test.push( "#..#....#.." );
    array_test.push( "..#.#.##.#." );
    array_test.push( "#####.....#" );
    array_test.push( "#..#..#####" );
    array_test.push( ".###......." );
    array_test.push( ".###......." );
    array_test.push( "#..#..#####" );
    array_test.push( "#####.....#" );
    array_test.push( "..#.#.##.#." );
    array_test.push( "#..#....#.." );
    array_test.push( "....##.###." );
    array_test.push( "..#.##...##" );
    array_test.push( ".....#..#.#" );
  
    return array_test;
}


wl( "Day 13 - Point of Incidence" );

calcArray( getTestArray1());
calcArray( getTestArray2());
calcArray( getTestArray3());

/*
1111 = tl
35159 = to hi
28244 = to hi
27692
26641
24654


Result Part 1 = 31913 - gleiche Schritte, der spätere gewinnt

Result Part 1 = 36090 - gleiche Schritte, aber nicht ohne Col-vergleich

Result Part 1 = 33167 - nur der erste 
*/

//checkReaddatei();
 