import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/11
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 * 
 *   0  .......#.     0  .........................................................#............
 *   1  .#.......     1  ....*......#..........................................................
 *   2  .........     2  .....**...............................................................
 *   3  .........     3  .......**.............................................................
 *   4  .........     4  .........**...........................................................
 *   5  .........     5  ...........**.........................................................
 *   6  .........     6  .............**.......................................................
 *   7  .........     7  ...............**.....................................................
 *   8  .........     8  .................**...................................................
 *   9  .........     9  ...................**.................................................
 *  10  .........    10  .....................**...............................................
 *  11  .........    11  .......................**.............................................
 *  12  .........    12  ......................................................................
 *  13  ......#..    13  ........................................................#.............
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 *     1 G1 - G2 = 5
 *     2 G1 - G3 = 5
 *     3 G1 - G4 = 8
 *     4 G1 - G5 = 8
 *     5 G1 - G6 = 13
 *     6 G1 - G7 = 14
 *     7 G1 - G8 = 14
 *     8 G1 - G9 = 12
 *     9 G2 - G3 = 8
 *    10 G2 - G4 = 5
 *    11 G2 - G5 = 11
 *    12 G2 - G6 = 8
 *    13 G2 - G7 = 9
 *    14 G2 - G8 = 17
 *    15 G2 - G9 = 13
 *    16 G3 - G4 = 9
 *    17 G3 - G5 = 5
 *    18 G3 - G6 = 14
 *    19 G3 - G7 = 15
 *    20 G3 - G8 = 9
 *    21 G3 - G9 = 13
 *    22 G4 - G5 = 6
 *    23 G4 - G6 = 5
 *    24 G4 - G7 = 6
 *    25 G4 - G8 = 12
 *    26 G4 - G9 = 8
 *    27 G5 - G6 = 9
 *    28 G5 - G7 = 10
 *    29 G5 - G8 = 6
 *    30 G5 - G9 = 8
 *    31 G6 - G7 = 5
 *    32 G6 - G8 = 13
 *    33 G6 - G9 = 9
 *    34 G7 - G8 = 8
 *    35 G7 - G9 = 4
 *    36 G8 - G9 = 4
 * nr_of_pairs 36
 * 
 *   0  ...#.....     0  ..QQQ.......
 *   1  .......#.     1  .QQQQQQQ.#..
 *   2  #........     2  QQQQQQQQQ...
 *   3  .........     3  QQQQQQQQQ...
 *   4  .........     4  QQQQQQQQQ...
 *   5  ......#..     5  QQQQQQQQQQ..
 *   6  .#.......     6  QQQQQQQQQQ..
 *   7  .........     7  QQQQQQQQQQ..
 *   8  .........     8  QQQQQQQQQQ..
 *   9  .........     9  QQQQQQQQQ...
 *  10  .......#.    10  QQQQQQQQ.#..
 *  11  #...#....    11  QQQQQQQ.....
 * 
 * 
 * Vektor G Galaxy G1     R      0 C      3
 * Vektor G Galaxy G2     R      1 C      7
 * Vektor G Galaxy G3     R      2 C      0
 * Vektor G Galaxy G4     R      5 C      6
 * Vektor G Galaxy G5     R      6 C      1
 * Vektor G Galaxy G6     R      7 C      9
 * Vektor G Galaxy G7     R     10 C      7
 * Vektor G Galaxy G8     R     11 C      0
 * Vektor G Galaxy G9     R     11 C      4
 * 
 * Result Part 1 = 328
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 * 1....1........
 * 2.........2...
 * 33............
 * 4.............
 * 5.............
 * 6........4....
 * 7.5...........
 * 8.##.........6
 * 9..##.........
 * 0...##........
 * 1....##...7...
 * 28....9.......
 * 
 * ----------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 * 0 G1 - G2 = 9
 * 
 *   0  ...X.....     0  ....X........
 *   1  .......X.     1  .........X...
 *   2  X........     2  X............
 *   3  .........     3  .............
 *   4  .........     4  .............
 *   5  ......X..     5  ........X....
 *   6  .#.......     6  .Q...........
 *   7  .........     7  .QQ..........
 *   8  .........     8  ..QQ.........
 *   9  .........     9  ...QQ........
 *  10  .......X.    10  ....QQ...X...
 *  11  X...#....    11  X....#.......
 * 
 * 
 * Vektor G Galaxy G1     R      6 C      1
 * Vektor G Galaxy G2     R     11 C      5
 * 
 * Result Part 1 = 9
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 * 0 G1 - G2 = 15
 * 
 *   0  ...#.....     0  ....Q........
 *   1  .......X.     1  ....QQ...X...
 *   2  X........     2  X....Q.......
 *   3  .........     3  .....QQ......
 *   4  .........     4  ......Q......
 *   5  ......X..     5  ......QQX....
 *   6  .X.......     6  .X.....Q.....
 *   7  .........     7  .......QQ....
 *   8  .........     8  ........Q....
 *   9  .........     9  ........QQ...
 *  10  .......#.    10  .........#...
 *  11  X...X....    11  X....X.......
 * 
 * 
 * Vektor G Galaxy G1     R      0 C      4
 * Vektor G Galaxy G2     R     10 C      9
 * 
 * Result Part 1 = 15
 * Result Part 2 = 0
 * 
 * Between galaxy 1 and galaxy 7: 15
 * 
 * ----------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 * 0 G1 - G2 = 17
 * 
 *   0  ...X.....     0  ....X........
 *   1  .......X.     1  .........X...
 *   2  #........     2  QQ...........
 *   3  .........     3  .QQ..........
 *   4  .........     4  ..QQ.........
 *   5  ......X..     5  ...QQ...X....
 *   6  .X.......     6  .X..QQ.......
 *   7  .........     7  .....QQ......
 *   8  .........     8  ......QQ.....
 *   9  .........     9  .......QQ....
 *  10  .......#.    10  ........Q#...
 *  11  X...X....    11  X....X.......
 * 
 * 
 * Vektor G Galaxy G1     R      2 C      0
 * Vektor G Galaxy G2     R     10 C      9
 * 
 * Result Part 1 = 17
 * Result Part 2 = 0
 * 
 * 
 * Between galaxy 3 and galaxy 6: 17
 * 
 * ----------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day11/day_11__Cosmic_Expansion.js
 * Day 11 - Cosmic Expansion
 * 0 G1 - G2 = 5
 * 
 *   0  ...X.....     0  ....X........
 *   1  .......X.     1  .........X...
 *   2  X........     2  X............
 *   3  .........     3  .............
 *   4  .........     4  .............
 *   5  ......X..     5  ........X....
 *   6  .X.......     6  .X...........
 *   7  .........     7  .............
 *   8  .........     8  .............
 *   9  .........     9  .............
 *  10  .......X.    10  .........X...
 *  11  #...#....    11  QQQQQ#.......
 * 
 * 
 * Vektor G Galaxy G1     R     11 C      0
 * Vektor G Galaxy G2     R     11 C      5
 * 
 * Result Part 1 = 5
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 *   0  .........     0  ...............................................................................
 *   1  .........     1  ...............................................................................
 *   2  .........     2  ....................8.....................................2....................
 *   3  .........     3  ....................888................1................222....................
 *   4  .........     4  ......................888..............1..............222......................
 *   5  .........     5  ........................888............1............222........................
 *   6  .........     6  ..........................888..........1..........222..........................
 *   7  .........     7  ............................888........1........222............................
 *   8  .........     8  ..............................888......1......222..............................
 *   9  .........     9  ................................888....1....222................................
 *  10  .........    10  ..................................888..1..222..................................
 *  11  .#.......    11  .Q.........#........................8881222....................................
 *  12  .........    12  .QQ.................777777777777777777884333333333333333333....................
 *  13  .........    13  ..Q.................................6665444....................................
 *  14  .........    14  ..Q...............................666..5..444..................................
 *  15  .........    15  ..Q.............................666....5....444................................
 *  16  .........    16  ..Q...........................666......5......444..............................
 *  17  .........    17  ..Q.........................666........5........444............................
 *  18  .........    18  ..Q.......................666..........5..........444..........................
 *  19  .........    19  ..Q.....................666............5............444........................
 *  20  .........    20  ..Q...................666..............5..............444......................
 *  21  .........    21  ..Q.................666................5................444....................
 *  22  .........    22  ..Q.................6.....................................4....................
 *  23  ..#......    23  ............#..................................................................
 * 
 * 
 */

type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER       : string = " ";

const MAP_CHAR_GALAXY_INACTIVE : string = "X";
const MAP_CHAR_GALAXY_ACTIVE   : string = "#";
const MAP_CHAR_SPACE           : string = ".";
const MAP_CHAR_LINE_1          : string = "Q";
const MAP_CHAR_LINE_STEP       : string = "Q";

const MAP_EXPANSION_PART_2 : number = 1_000_000;

class GalaxyPos 
{
    m_galaxy_name  : string;
    m_galaxy_row   : number;
    m_galaxy_col   : number;

    constructor ( pGalaxyName : string, pGalaxyRow : number, pGalaxyCol : number  )
    {
        this.m_galaxy_name = pGalaxyName;

        this.m_galaxy_row = pGalaxyRow;

        this.m_galaxy_col = pGalaxyCol;
    }

    public getGalaxyName() : string 
    {
        return this.m_galaxy_name;
    }

    public getGalaxyRow() : number
    {
        return this.m_galaxy_row;
    }

    public getGalaxyCol() : number
    {
        return this.m_galaxy_col;
    }

    public toString() : string 
    {
        return "Galaxy " + padR( this.m_galaxy_name, 5 ) + "  R " + pad( this.m_galaxy_row, 6 ) + " C " + pad( this.m_galaxy_col, 6 );
    }
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    fs.writeFile( pFileName, pFileData, { flag: "w" } );

    console.log( "File created!" );
}


function combineStrings(pString1: string | undefined | null, pString2: string | undefined | null): string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
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


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
    }

    return str_result;
}


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number  ): string 
{
    let str_result : string = "";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? MAP_CHAR_SPACE;
        }

        str_result += "\n";
    }

    return str_result;
}


function lineBresenham( pMap : PropertieMap,  pRow1 : number, pCol1 : number, pRow2 : number, pCol2 : number, pChar1 : string = MAP_CHAR_LINE_1, pChar2 : string = MAP_CHAR_LINE_STEP, pKnzDebug : boolean = false ) : number
{
    // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

    /*
     * Calculating the (absolute) width and height of the Rectangle
     */
    let pos_row_width  : number = Math.abs( pRow2 - pRow1 );
    let pos_col_height : number = Math.abs( pCol1 - pCol2 );

    /*
     * Calculating the direction of the line:
     * -1 = line direction to the left (to the beginning)
     *  0 = no movement 
     *  1 = line direction to the right 
     */
    let pos_row_plus_value : number = Math.sign( pRow2 - pRow1 );
    let pos_col_plus_value : number = Math.sign( pCol2 - pCol1 );

    let pixel_count_target : number = 0;
    let pixel_count_cur    : number = 1;

    let error_value        : number = 0;
    let error_plus         : number = 0;
    let error_reset        : number = 0;
    
    let knz_direction_col_axis : boolean = true;

    let count_steps : number = 0;

    if ( pos_row_width >= pos_col_height ) 
    {
        pixel_count_target = pos_row_width
        
        error_plus = pos_col_height
        
        error_reset = pos_row_width
    }
    else
    {
        pixel_count_target = pos_col_height
        
        error_plus = pos_row_width
        
        error_reset = pos_col_height
        
        knz_direction_col_axis = false
    }

    while ( pixel_count_cur <= pixel_count_target )
    {
        if ( pKnzDebug )
        {
            pMap[ "R" + pRow1 + "C" + pCol1 ] = pChar1;
        }

        count_steps++;

        error_value += error_plus

        if ( knz_direction_col_axis )
        {
            if ( error_value > 0 )
            {
                if ( pKnzDebug )
                {
                    pMap[ "R" + ( pRow1 + pos_row_plus_value ) + "C" + pCol1 ] = pChar2;
                }

                count_steps++;

                pCol1 += pos_col_plus_value;

                error_value = error_value - error_reset;
            }
            
            pRow1 += pos_row_plus_value;            
        }
        else 
        {
            if ( error_value > 0 )
            {
                if ( pKnzDebug )
                {
                    pMap[ "R" + pRow1 + "C" +( pCol1 + pos_col_plus_value) ] = pChar2;
                }

                count_steps++;

                pRow1 += pos_row_plus_value;

                error_value = error_value - error_reset;
            }
            
            pCol1 += pos_col_plus_value;
        }

        pixel_count_cur++;
    }

    return count_steps;
}


function calcArray( pArray: string[], pKnzExpansionFactorRow : number = 1, pKnzExpansionFactorCol : number = 1, pKnzDebug : boolean = true ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the grid and expansion of rows
     * *******************************************************************************************************
     */

    console.log( "init grid - row expansion " );

    let map_input : PropertieMap = {};

    let expansion_factor_row = pKnzExpansionFactorRow > 0 ? pKnzExpansionFactorRow : 0;
    let expansion_factor_col = pKnzExpansionFactorCol > 0 ? pKnzExpansionFactorCol : 0;

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let check_only_space : boolean = true;

        let cur_modified_input_str = cur_input_str;

        for ( let cur_col1 = 0; cur_col1 < cur_modified_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_modified_input_str[ grid_cols ] ?? MAP_CHAR_SPACE;

            if ( ( cur_char_input === MAP_CHAR_GALAXY_ACTIVE ) || ( cur_char_input === MAP_CHAR_GALAXY_INACTIVE ))
            {
                check_only_space = false;
            }

            map_input[ "R" + grid_rows + "C" + grid_cols ] = cur_char_input;
        }

        grid_rows++;

        if ( check_only_space )
        {
            for ( let nr_row_expansion = 0; nr_row_expansion < expansion_factor_row; nr_row_expansion++ )
            {
                for ( let cur_col1 = 0; cur_col1 < cur_modified_input_str.length; cur_col1++ ) 
                {
                    grid_cols = cur_col1;

                    map_input[ "R" + grid_rows + "C" + grid_cols ] = MAP_CHAR_SPACE;
                }

                grid_rows++;
            }
        }
    }

    grid_cols++;

    /*
     * *******************************************************************************************************
     * Expansion cols
     * *******************************************************************************************************
     */

    console.log( "init grid - col expansion R "  + grid_rows + " C " + grid_cols);

    let map_universe    : PropertieMap = {};

    let grid_rows_input : number = grid_rows;
    let grid_cols_input : number = grid_cols;

    grid_cols = 0;

    for ( let nr_col_input = 0; nr_col_input < grid_cols_input; nr_col_input++  )
    {
        let check_only_space : boolean = true;

        for ( let nr_row_input = 0; nr_row_input < grid_rows_input; nr_row_input++  )
        {
            let hash_map_input_key    = "R" + nr_row_input + "C" + nr_col_input;
            let hash_map_universe_key = "R" + nr_row_input + "C" + grid_cols;

            let cur_char_input : string = map_input[ hash_map_input_key ] ?? MAP_CHAR_SPACE;

            if ( ( cur_char_input === MAP_CHAR_GALAXY_ACTIVE ) || ( cur_char_input === MAP_CHAR_GALAXY_INACTIVE ))
            {
                check_only_space = false;
            }

            map_universe[ hash_map_universe_key ] = cur_char_input;
        }

        grid_cols++;

        if ( check_only_space )
        {
            for ( let nr_col_expansion = 0; nr_col_expansion < expansion_factor_col; nr_col_expansion++ )
            {
                for ( let nr_row_input = 0; nr_row_input < grid_rows_input; nr_row_input++  )
                {
                    map_universe[ "R" + nr_row_input + "C" + grid_cols ] = MAP_CHAR_SPACE;
                }

                grid_cols++;
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Collecting the Galaxy's (Row-Based, hence the extra loops. To get the numbering from the sample)
     * *******************************************************************************************************
     */

    console.log( "Collecting Galaxys -  R "  + grid_rows + " C " + grid_cols);

    let map_galaxys : GalaxyPos[] = [];

    for ( let nr_row_input = 0; nr_row_input < grid_rows; nr_row_input++  )
    {
        for ( let nr_col_input = 0; nr_col_input < grid_cols; nr_col_input++  )
        {
            let cur_char_input : string = map_universe[ "R" + nr_row_input + "C" + nr_col_input ] ?? MAP_CHAR_SPACE;

            if ( cur_char_input === MAP_CHAR_GALAXY_ACTIVE )
            {
                map_galaxys.push( new GalaxyPos( "G" + ( map_galaxys.length + 1 ), nr_row_input, nr_col_input ) );
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Debugging the bresenham line algorithm
     * *******************************************************************************************************
     */

    const map_copy: PropertieMap = { ...map_universe };
    
    let knz_debug_bresenham : boolean = false;

    if ( knz_debug_bresenham )
    {
        let center_row = Math.floor( grid_rows / 2 )
        let center_col = Math.floor( grid_cols / 2 )

        let col_value = Math.floor( center_col / 2 ) + 1;

        lineBresenham( map_universe, center_row, center_col, center_row - 10, center_col, "1", "1" );

        lineBresenham( map_universe, center_row, center_col, center_row - 10, center_col + col_value, "2", "2" );

        lineBresenham( map_universe, center_row, center_col, center_row, center_col + col_value, "3", "3" );

        lineBresenham( map_universe, center_row, center_col, center_row + 10, center_col + col_value, "4", "4" );

        lineBresenham( map_universe, center_row, center_col, center_row + 10, center_col, "5", "5" );

        lineBresenham( map_universe, center_row, center_col, center_row + 10, center_col - col_value, "6", "6" );

        lineBresenham( map_universe, center_row, center_col, center_row, center_col - col_value, "7", "7" );

        lineBresenham( map_universe, center_row, center_col, center_row - 10, center_col - col_value, "8", "8" );
    }

    /*
     * *******************************************************************************************************
     * Calculating the direct lines for the pair of galaxys
     * *******************************************************************************************************
     */
    let nr_of_galaxys : number = map_galaxys.length;
    let nr_of_pairs   : number = 0;

    let vector_pairs_visited : string[] = [];

    for ( let index_1 = 0; index_1 < nr_of_galaxys; index_1++ )
    {
        console.log( "index 1 " + index_1 + " of " + nr_of_galaxys + " " + result_part_01 + " " + nr_of_pairs );

        for ( let index_2 = 0; index_2 < nr_of_galaxys; index_2++ )
        {
            if ( ( index_1 != index_2 ) && ( ! vector_pairs_visited.includes( "G1 " + index_1 + "G2 " +  index_2 ) ) )
            {
                vector_pairs_visited.push( "G1 " + index_1 + "G2 " +  index_2);
                vector_pairs_visited.push( "G1 " + index_2 + "G2 " +  index_1);

                let galaxy_inst_1 : GalaxyPos = map_galaxys[ index_1 ]!;
                let galaxy_inst_2 : GalaxyPos = map_galaxys[ index_2 ]!;

                let step_count = lineBresenham( map_universe, galaxy_inst_1.getGalaxyRow(), galaxy_inst_1.getGalaxyCol(),galaxy_inst_2.getGalaxyRow(), galaxy_inst_2.getGalaxyCol() );

                nr_of_pairs++;

                result_part_01 += step_count;

                if ( pKnzDebug )
                {
                    console.log( pad( nr_of_pairs, 5 ) + " " + galaxy_inst_1.getGalaxyName() + " - " + galaxy_inst_2.getGalaxyName() + " = " + step_count );
                }
            }
        }        
    }

    /*
     * *******************************************************************************************************
     * Doing some Debug-Stuff
     * *******************************************************************************************************
     */
    console.log( "nr_of_pairs " + nr_of_pairs )

    if ( pKnzDebug )
    {
        console.log( "" );
        console.log( combineStrings( combineStrings( getDebugMap( map_input, grid_rows_input, grid_cols_input ) , getDebugMap( map_copy, grid_rows, grid_cols ) ), getDebugMap( map_universe, grid_rows, grid_cols ) ) );
        console.log( "" );

        for ( const galaxy_c of map_galaxys )
        {
            console.log( "Vektor G " + galaxy_c.toString() );
        }
    }

    console.log( "" );
    console.log( "Result Part 1 = " + result_part_01 );
    console.log( "Result Part 2 = " + result_part_02 );
}


async function readFileLines(): Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2023__day11_input.txt";

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


function checkReaddatei( pExpansion : number): void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, pExpansion, pExpansion, false );
    } )();
}


function getTestArray1(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...#......" );
    array_test.push( ".......#.." );
    array_test.push( "#........." );
    array_test.push( ".........." );
    array_test.push( "......#..." );
    array_test.push( ".#........" );
    array_test.push( ".........#" );
    array_test.push( ".........." );
    array_test.push( ".......#.." );
    array_test.push( "#...#....." );

    return array_test;
}


function getTestArray1a(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...X......" );
    array_test.push( ".......X.." );
    array_test.push( "X........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".#........" );
    array_test.push( ".........X" );
    array_test.push( ".........." );
    array_test.push( ".......X.." );
    array_test.push( "X...#....." );

    return array_test;
}


function getTestArray1b(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...#......" );
    array_test.push( ".......X.." );
    array_test.push( "X........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".X........" );
    array_test.push( ".........X" );
    array_test.push( ".........." );
    array_test.push( ".......#.." );
    array_test.push( "X...X....." );

    return array_test;
}


function getTestArray1c(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...X......" );
    array_test.push( ".......X.." );
    array_test.push( "#........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".X........" );
    array_test.push( ".........#" );
    array_test.push( ".........." );
    array_test.push( ".......X.." );
    array_test.push( "X...X....." );

    return array_test;
}


function getTestArray1d(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...X......" );
    array_test.push( ".......X.." );
    array_test.push( "X........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".X........" );
    array_test.push( ".........X" );
    array_test.push( ".........." );
    array_test.push( ".......X.." );
    array_test.push( "#...#....." );

    return array_test;
}


function getTestArray1e(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...X......" );
    array_test.push( ".......X.." );
    array_test.push( "#........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".X........" );
    array_test.push( ".........X" );
    array_test.push( ".........." );
    array_test.push( ".......X.." );
    array_test.push( "#...#....." );

    return array_test;
}



function getTestArray1f(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "...X......" );
    array_test.push( ".......#.." );
    array_test.push( "X........." );
    array_test.push( ".........." );
    array_test.push( "......X..." );
    array_test.push( ".X........" );
    array_test.push( ".........#" );
    array_test.push( ".........." );
    array_test.push( ".......X.." );
    array_test.push( "X...X....." );

    return array_test;
}


function getTestArray2(): string[] 
{
    const array_test: string[] = [];

    array_test.push( ".........." );
    array_test.push( ".#........" );
    array_test.push( ".........." );
    array_test.push( "..#......." );

    return array_test;
}


console.log( "Day 11 - Cosmic Expansion" );

//calcArray( getTestArray1(), 1, 1, true );
//calcArray( getTestArray2(), 10, 10, true );

checkReaddatei( 1 );
