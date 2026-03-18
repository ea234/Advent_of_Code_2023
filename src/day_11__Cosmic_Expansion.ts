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
    m_galaxy_name         : string;
    m_galaxy_row_input    : number;
    m_galaxy_col_input    : number;

    m_galaxy_row_virtuell : number;
    m_galaxy_col_virtuell : number;

    m_galaxy_active       : boolean;

    constructor ( pGalaxyName : string, pGalaxyRow : number, pGalaxyCol : number, pKnzActive : boolean = true )
    {
        this.m_galaxy_name = pGalaxyName;

        this.m_galaxy_row_input = pGalaxyRow;

        this.m_galaxy_col_input = pGalaxyCol;

        this.m_galaxy_row_virtuell = pGalaxyRow;
        this.m_galaxy_col_virtuell = pGalaxyCol;

        this.m_galaxy_active = pKnzActive;
    }

    public getGalaxyName() : string 
    {
        return this.m_galaxy_name;
    }

    public getGalaxyRowInput() : number
    {
        return this.m_galaxy_row_input;
    }

    public getGalaxyRowVirtuell() : number
    {
        return this.m_galaxy_row_virtuell;
    }

    public addGalaxyRow( pAddValue : number ) : void
    {
        this.m_galaxy_row_virtuell += pAddValue;
    }

    public getGalaxyColInput() : number
    {
        return this.m_galaxy_col_input;
    }

    public getGalaxyColVirtuell() : number
    {
        return this.m_galaxy_col_virtuell;
    }

    public addGalaxyCol( pAddValue : number ) : void
    {
        this.m_galaxy_col_virtuell += pAddValue;
    }

    public isGalaxyActive() : boolean 
    {
        return this.m_galaxy_active;
    }

    public toString() : string 
    {
        return "Galaxy " + padR( this.m_galaxy_name, 5 ) + "  R " + pad( this.m_galaxy_row_input, 6 ) + " C " + pad( this.m_galaxy_col_input, 6 ) + "        RV " + pad( this.m_galaxy_row_virtuell, 6 ) + " CV " + pad( this.m_galaxy_col_virtuell, 6 ) + "  active " + this.m_galaxy_active;
    }
}


function writeFile( pFileName: string, pFileData: string ): void 
{
    fs.writeFile( pFileName, pFileData, { flag: "w" } );

    console.log( "File created!" );
}


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null ): string 
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
     * Collecting the Galaxys from Input
     * *******************************************************************************************************
     */

    console.log( "init grid - row expansion " );

    let map_galaxys : GalaxyPos[] = [];

    let expansion_factor_row = pKnzExpansionFactorRow > 0 ? pKnzExpansionFactorRow : 0;
    let expansion_factor_col = pKnzExpansionFactorCol > 0 ? pKnzExpansionFactorCol : 0;

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 0;
    let grid_cols : number = 0;

    let row_galaxy : number[] = [];
    let col_galaxy : number[] = [];

    for ( const cur_input_str of pArray ) 
    {
        let check_only_space : boolean = true;

        row_galaxy[ grid_rows ] = 0;

        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_input_str[ grid_cols ] ?? MAP_CHAR_SPACE;

            if ( ( cur_char_input === MAP_CHAR_GALAXY_ACTIVE ) || ( cur_char_input === MAP_CHAR_GALAXY_INACTIVE ))
            {
                map_galaxys.push( new GalaxyPos( "G" + ( map_galaxys.length + 1 ), grid_rows, grid_cols, ( cur_char_input === MAP_CHAR_GALAXY_ACTIVE ) ) );

                check_only_space = false;

                row_galaxy[ grid_rows ] = 1;
                col_galaxy[ grid_cols ] = 1;
            }
        }

        grid_rows++;
    }

    grid_cols++;

    console.log( "" );
    console.log( row_galaxy );
    console.log( "" );

    for ( const galaxy_c of map_galaxys )
    {
        console.log( "Vektor G " + galaxy_c.toString() );
    }

    /*
     * *******************************************************************************************************
     * Expansion Rows
     * *******************************************************************************************************
     */
    console.log( "row expansion R "  + grid_rows + " C " + grid_cols);

    let grid_rows_input : number = grid_rows;
    let grid_cols_input : number = grid_cols;

    for ( let nr_row_input = 0; nr_row_input < grid_rows_input; nr_row_input++  )
    {
        if ( ( row_galaxy[ nr_row_input ] ?? 0) === 0 )
        {
            console.log( "Row " + nr_row_input );

            for ( const galaxy_c of map_galaxys )
            {
                if ( galaxy_c.getGalaxyRowInput() > nr_row_input )
                {
                    galaxy_c.addGalaxyRow( expansion_factor_row );

                    console.log( "Vektor G ADD " + expansion_factor_row + " " + galaxy_c.toString() );
                }
            }
        }
    }

    /*
     * *******************************************************************************************************
     * Expansion Cols
     * *******************************************************************************************************
     */
    console.log( "col expansion R "  + grid_rows + " C " + grid_cols);

    for ( let nr_col_input = 0; nr_col_input < grid_cols_input; nr_col_input++  )
    {
        if ( ( col_galaxy[ nr_col_input ] ?? 0) === 0 )
        {
            console.log( "Row " + nr_col_input );

            for ( const galaxy_c of map_galaxys )
            {
                if ( galaxy_c.getGalaxyColInput() > nr_col_input )
                {
                    galaxy_c.addGalaxyCol( expansion_factor_col );

                    console.log( "Vektor G ADD " + expansion_factor_row + " " + galaxy_c.toString() );
                }
            }
        }
    }

    let map_universe    : PropertieMap = {};

    grid_cols = 0;

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

    const start_date = new Date();

    for ( let index_1 = 0; index_1 < nr_of_galaxys; index_1++ )
    {
        const now = new Date();

        console.log( "index 1 " + index_1 + " of " + nr_of_galaxys + " " + result_part_01 + " " + nr_of_pairs + " " + now.toISOString() );

        for ( let index_2 = 0; index_2 < nr_of_galaxys; index_2++ )
        {
            if ( ( index_1 != index_2 ) && ( ! vector_pairs_visited.includes( "G1 " + index_1 + "G2 " +  index_2 ) ) )
            {
                vector_pairs_visited.push( "G1 " + index_1 + "G2 " +  index_2);
                vector_pairs_visited.push( "G1 " + index_2 + "G2 " +  index_1);

                let galaxy_inst_1 : GalaxyPos = map_galaxys[ index_1 ]!;
                let galaxy_inst_2 : GalaxyPos = map_galaxys[ index_2 ]!;

                let step_count = lineBresenham( map_universe, galaxy_inst_1.getGalaxyRowVirtuell(),                 
                galaxy_inst_1.getGalaxyColVirtuell(),
                galaxy_inst_2.getGalaxyRowVirtuell(), 
                galaxy_inst_2.getGalaxyColVirtuell(), MAP_CHAR_LINE_1, MAP_CHAR_LINE_STEP, pKnzDebug );

                nr_of_pairs++;

                result_part_01 += step_count;

                if ( pKnzDebug )
                {
                    console.log( pad( nr_of_pairs, 5 ) + " " + galaxy_inst_1.getGalaxyName() + " - " + galaxy_inst_2.getGalaxyName() + " = " + step_count );
                }
            }
        }        
    }

    console.log( "start " + start_date.toISOString() );

    /*
     * *******************************************************************************************************
     * Doing some Debug-Stuff
     * *******************************************************************************************************
     */
    console.log( "nr_of_pairs " + nr_of_pairs )

    if ( pKnzDebug )
    {
        console.log( "" );
        // console.log( combineStrings( combineStrings( getDebugMap( map_copy, grid_rows_input, grid_cols_input ) , getDebugMap( map_copy, grid_rows, grid_cols ) ), getDebugMap( map_universe, grid_rows, grid_cols ) ) );
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

//calcArray( getTestArray1(), MAP_EXPANSION_PART_2, MAP_EXPANSION_PART_2, true );
//calcArray( getTestArray1(), 10, 10, true );
//calcArray( getTestArray2(), 10, 10, true );

checkReaddatei( MAP_EXPANSION_PART_2 );

/*
 * index 1 0 of 439 0 0 2026-03-18T09:42:50.795Z
 * index 1 1 of 439 3053060315 438 2026-03-18T09:43:02.150Z
 * index 1 2 of 439 6106115952 875 2026-03-18T09:43:12.939Z
 * index 1 3 of 439 8802162741 1311 2026-03-18T09:43:21.971Z
 * index 1 4 of 439 11606211926 1746 2026-03-18T09:43:30.796Z
 * index 1 5 of 439 14615263959 2180 2026-03-18T09:43:40.666Z
 * index 1 6 of 439 17650315658 2613 2026-03-18T09:43:51.538Z
 * index 1 7 of 439 20685364828 3045 2026-03-18T09:44:01.964Z
 * index 1 8 of 439 23720411670 3476 2026-03-18T09:44:12.629Z
 * index 1 9 of 439 26319456636 3906 2026-03-18T09:44:21.045Z
 * index 1 10 of 439 29102502752 4335 2026-03-18T09:44:29.804Z
 * index 1 11 of 439 32086561132 4763 2026-03-18T09:44:39.447Z
 * index 1 12 of 439 35104617454 5190 2026-03-18T09:44:50.283Z
 * index 1 13 of 439 37864662625 5616 2026-03-18T09:44:59.244Z
 * index 1 14 of 439 40452706364 6041 2026-03-18T09:45:07.645Z
 * index 1 15 of 439 43040750223 6465 2026-03-18T09:45:16.050Z
 * index 1 16 of 439 45808796270 6888 2026-03-18T09:45:25.134Z
 * index 1 17 of 439 48810847597 7310 2026-03-18T09:45:35.753Z
 * index 1 18 of 439 51812896558 7731 2026-03-18T09:45:46.715Z
 * index 1 19 of 439 54390939787 8151 2026-03-18T09:45:55.480Z
 * index 1 20 of 439 56968983420 8570 2026-03-18T09:46:03.977Z
 * index 1 21 of 439 59620027559 8988 2026-03-18T09:46:12.667Z
 * index 1 22 of 439 62563075288 9405 2026-03-18T09:46:24.661Z
 * index 1 23 of 439 65545120205 9821 2026-03-18T09:46:37.606Z
 * index 1 24 of 439 68115163146 10236 2026-03-18T09:46:47.602Z
 * index 1 25 of 439 71093209301 10650 2026-03-18T09:46:59.711Z
 * index 1 26 of 439 73829253122 11063 2026-03-18T09:47:10.639Z
 * index 1 27 of 439 76754298752 11475 2026-03-18T09:47:22.303Z
 * index 1 28 of 439 79719354386 11886 2026-03-18T09:47:35.360Z
 * index 1 29 of 439 82276396060 12296 2026-03-18T09:47:45.966Z
 * index 1 30 of 439 85191444456 12705 2026-03-18T09:47:57.598Z
 * index 1 31 of 439 88106498922 13113 2026-03-18T09:48:08.546Z
 * index 1 32 of 439 91053550068 13520 2026-03-18T09:48:20.449Z
 * index 1 33 of 439 93871592499 13926 2026-03-18T09:48:31.564Z
 * index 1 34 of 439 96487634316 14331 2026-03-18T09:48:41.608Z
 * index 1 35 of 439 99387685888 14735 2026-03-18T09:48:52.595Z
 * index 1 36 of 439 102321734426 15138 2026-03-18T09:49:04.559Z
 * index 1 37 of 439 105015775659 15540 2026-03-18T09:49:15.081Z
 * index 1 38 of 439 107549816290 15941 2026-03-18T09:49:24.839Z
 * index 1 39 of 439 110477867704 16341 2026-03-18T09:49:36.577Z
 * index 1 40 of 439 113007907966 16740 2026-03-18T09:49:46.434Z
 * index 1 41 of 439 115931953782 17138 2026-03-18T09:49:58.454Z
 * index 1 42 of 439 118855996208 17535 2026-03-18T09:50:10.137Z
 * index 1 43 of 439 121536038097 17931 2026-03-18T09:50:20.322Z
 * index 1 44 of 439 124396082072 18326 2026-03-18T09:50:31.219Z
 * index 1 45 of 439 127256127489 18720 2026-03-18T09:50:42.120Z
 * index 1 46 of 439 129926167512 19113 2026-03-18T09:50:52.555Z
 * index 1 47 of 439 132438206567 19505 2026-03-18T09:51:02.357Z
 * index 1 48 of 439 135290253752 19896 2026-03-18T09:51:13.147Z
 * index 1 49 of 439 138142304638 20286 2026-03-18T09:51:23.875Z
 * index 1 50 of 439 141026347612 20675 2026-03-18T09:51:35.613Z
 * index 1 51 of 439 143910395947 21063 2026-03-18T09:51:47.227Z
 * index 1 52 of 439 146794440724 21450 2026-03-18T09:51:58.852Z
 * index 1 53 of 439 149678480281 21836 2026-03-18T09:52:10.280Z
 * index 1 54 of 439 152502521376 22221 2026-03-18T09:52:20.794Z
 * index 1 55 of 439 154989558664 22605 2026-03-18T09:52:30.401Z
 * index 1 56 of 439 157476595760 22988 2026-03-18T09:52:39.894Z
 * index 1 57 of 439 160345636551 23370 2026-03-18T09:52:51.314Z
 * index 1 58 of 439 163214675830 23751 2026-03-18T09:53:02.891Z
 * index 1 59 of 439 165693712588 24131 2026-03-18T09:53:12.569Z
 * index 1 60 of 439 168320750302 24510 2026-03-18T09:53:22.646Z
 * index 1 61 of 439 171120792289 24888 2026-03-18T09:53:33.291Z
 * index 1 62 of 439 173972840956 25265 2026-03-18T09:53:44.977Z
 * index 1 63 of 439 176765881106 25641 2026-03-18T09:53:56.296Z
 * index 1 64 of 439 179558929286 26016 2026-03-18T09:54:07.257Z
 * index 1 65 of 439 182176967074 26390 2026-03-18T09:54:17.643Z
 * index 1 66 of 439 184969009162 26763 2026-03-18T09:54:28.683Z
 * index 1 67 of 439 187794050613 27135 2026-03-18T09:54:40.635Z
 * index 1 68 of 439 190619087492 27506 2026-03-18T09:54:52.084Z
 * index 1 69 of 439 193070122981 27876 2026-03-18T09:55:01.893Z
 * index 1 70 of 439 195521158172 28245 2026-03-18T09:55:12.014Z
 * index 1 71 of 439 198293202486 28613 2026-03-18T09:55:23.121Z
 * index 1 72 of 439 201065241830 28980 2026-03-18T09:55:34.912Z
 * index 1 73 of 439 203143275709 29346 2026-03-18T09:55:43.465Z
 * index 1 74 of 439 205373310616 29711 2026-03-18T09:55:52.715Z
 * index 1 75 of 439 207799347295 30075 2026-03-18T09:56:02.795Z
 * index 1 76 of 439 209871381032 30438 2026-03-18T09:56:11.282Z
 * index 1 77 of 439 212093416042 30800 2026-03-18T09:56:19.861Z
 * index 1 78 of 439 214483453076 31161 2026-03-18T09:56:29.055Z
 * index 1 79 of 439 216873493282 31521 2026-03-18T09:56:38.117Z
 * index 1 80 of 439 219275530502 31880 2026-03-18T09:56:48.190Z
 * index 1 81 of 439 221335563453 32238 2026-03-18T09:56:56.587Z
 * index 1 82 of 439 223715601664 32595 2026-03-18T09:57:05.592Z
 * index 1 83 of 439 226106639520 32951 2026-03-18T09:57:15.209Z
 * index 1 84 of 439 228387673012 33306 2026-03-18T09:57:24.340Z
 * index 1 85 of 439 230777707234 33660 2026-03-18T09:57:34.066Z
 * index 1 86 of 439 232823739410 34013 2026-03-18T09:57:42.209Z
 * index 1 87 of 439 235180775762 34365 2026-03-18T09:57:51.310Z
 * index 1 88 of 439 237559817488 34716 2026-03-18T09:58:01.097Z
 * index 1 89 of 439 239938855959 35066 2026-03-18T09:58:10.678Z
 * index 1 90 of 439 241973887784 35415 2026-03-18T09:58:18.886Z
 * index 1 91 of 439 244313930569 35763 2026-03-18T09:58:27.674Z
 * index 1 92 of 439 246681973402 36110 2026-03-18T09:58:37.242Z
 * index 1 93 of 439 249050012742 36456 2026-03-18T09:58:46.889Z
 * index 1 94 of 439 251418046692 36801 2026-03-18T09:58:56.620Z
 * index 1 95 of 439 253495078254 37145 2026-03-18T09:59:04.937Z
 * index 1 96 of 439 255652110516 37488 2026-03-18T09:59:13.280Z
 * index 1 97 of 439 257809143516 37830 2026-03-18T09:59:21.638Z
 * index 1 98 of 439 260160178674 38171 2026-03-18T09:59:31.314Z
 * index 1 99 of 439 262511214646 38511 2026-03-18T09:59:40.762Z
 * index 1 100 of 439 264654245550 38850 2026-03-18T09:59:49.145Z
 * index 1 101 of 439 266659275680 39188 2026-03-18T09:59:56.923Z
 * index 1 102 of 439 268952308826 39525 2026-03-18T10:00:05.481Z
 * index 1 103 of 439 271245343476 39861 2026-03-18T10:00:14.198Z
 * index 1 104 of 439 273538380208 40196 2026-03-18T10:00:22.823Z
 * index 1 105 of 439 275862411376 40530 2026-03-18T10:00:32.087Z
 * index 1 106 of 439 278148449882 40863 2026-03-18T10:00:40.658Z
 * index 1 107 of 439 280137479294 41195 2026-03-18T10:00:48.394Z
 * index 1 108 of 439 282126508730 41526 2026-03-18T10:00:56.068Z
 * index 1 109 of 439 284435545693 41856 2026-03-18T10:01:05.262Z
 * index 1 110 of 439 286708578262 42185 2026-03-18T10:01:13.744Z
 * index 1 111 of 439 289010613450 42513 2026-03-18T10:01:22.883Z
 * index 1 112 of 439 291208642826 42840 2026-03-18T10:01:31.581Z
 * index 1 113 of 439 293183671221 43166 2026-03-18T10:01:39.359Z
 * index 1 114 of 439 295440710016 43491 2026-03-18T10:01:47.744Z
 * index 1 115 of 439 297730748334 43815 2026-03-18T10:01:56.892Z
 * index 1 116 of 439 300020778658 44138 2026-03-18T10:02:05.947Z
 * index 1 117 of 439 302112808700 44460 2026-03-18T10:02:13.827Z
 * index 1 118 of 439 304354843480 44781 2026-03-18T10:02:22.192Z
 * index 1 119 of 439 306631876122 45101 2026-03-18T10:02:31.385Z
 * index 1 120 of 439 308908907300 45420 2026-03-18T10:02:40.409Z
 * index 1 121 of 439 311185936088 45738 2026-03-18T10:02:49.361Z
 * index 1 122 of 439 313132963394 46055 2026-03-18T10:02:56.978Z
 * index 1 123 of 439 315350995635 46371 2026-03-18T10:03:05.280Z
 * index 1 124 of 439 317421023784 46686 2026-03-18T10:03:13.222Z
 * index 1 125 of 439 319638058848 47000 2026-03-18T10:03:21.525Z
 * index 1 126 of 439 321891088376 47313 2026-03-18T10:03:30.573Z
 * index 1 127 of 439 324144116746 47625 2026-03-18T10:03:39.687Z
 * index 1 128 of 439 326397150726 47936 2026-03-18T10:03:48.731Z
 * index 1 129 of 439 328324177073 48246 2026-03-18T10:03:56.274Z
 * index 1 130 of 439 330251203326 48555 2026-03-18T10:04:03.769Z
 * index 1 131 of 439 332227229871 48863 2026-03-18T10:04:11.291Z
 * index 1 132 of 439 334273257758 49170 2026-03-18T10:04:19.006Z
 * index 1 133 of 439 336460287282 49476 2026-03-18T10:04:27.162Z
 * index 1 134 of 439 338647318974 49781 2026-03-18T10:04:35.267Z
 * index 1 135 of 439 340867348724 50085 2026-03-18T10:04:44.047Z
 * index 1 136 of 439 343087379642 50388 2026-03-18T10:04:52.896Z
 * index 1 137 of 439 345119405682 50690 2026-03-18T10:05:00.865Z
 * index 1 138 of 439 347287437422 50991 2026-03-18T10:05:09.163Z
 * index 1 139 of 439 349192462310 51291 2026-03-18T10:05:16.656Z
 * index 1 140 of 439 351357491916 51590 2026-03-18T10:05:25.117Z
 * index 1 141 of 439 353557524355 51888 2026-03-18T10:05:34.213Z
 * index 1 142 of 439 355757555296 52185 2026-03-18T10:05:43.035Z
 * index 1 143 of 439 357769580736 52481 2026-03-18T10:05:50.686Z
 * index 1 144 of 439 359781607306 52776 2026-03-18T10:05:58.324Z
 * index 1 145 of 439 361930641201 53070 2026-03-18T10:06:06.215Z
 * index 1 146 of 439 364111674924 53363 2026-03-18T10:06:14.955Z
 * index 1 147 of 439 366292701519 53655 2026-03-18T10:06:23.731Z
 * index 1 148 of 439 368473727166 53946 2026-03-18T10:06:32.422Z
 * index 1 149 of 439 370470751578 54236 2026-03-18T10:06:40.133Z
 * index 1 150 of 439 372593782886 54525 2026-03-18T10:06:47.913Z
 * index 1 151 of 439 374512806770 54813 2026-03-18T10:06:55.217Z
 * index 1 152 of 439 376499831782 55100 2026-03-18T10:07:02.741Z
 * index 1 153 of 439 378619859080 55386 2026-03-18T10:07:10.615Z
 * index 1 154 of 439 380739888138 55671 2026-03-18T10:07:18.515Z
 * index 1 155 of 439 382886914699 55955 2026-03-18T10:07:27.188Z
 * index 1 156 of 439 385033941896 56238 2026-03-18T10:07:35.752Z
 * index 1 157 of 439 386886964868 56520 2026-03-18T10:07:42.976Z
 * index 1 158 of 439 388739987544 56801 2026-03-18T10:07:50.136Z
 * index 1 159 of 439 390840012587 57081 2026-03-18T10:07:58.114Z
 * index 1 160 of 439 392940039934 57360 2026-03-18T10:08:05.899Z
 * index 1 161 of 439 395040071150 57638 2026-03-18T10:08:13.634Z
 * index 1 162 of 439 396884093424 57915 2026-03-18T10:08:20.982Z
 * index 1 163 of 439 398728115805 58191 2026-03-18T10:08:28.108Z
 * index 1 164 of 439 400838140024 58466 2026-03-18T10:08:36.394Z
 * index 1 165 of 439 402794162808 58740 2026-03-18T10:08:43.779Z
 * index 1 166 of 439 404750186468 59013 2026-03-18T10:08:51.151Z
 * index 1 167 of 439 406848215667 59285 2026-03-18T10:08:59.525Z
 * index 1 168 of 439 408946238734 59556 2026-03-18T10:09:07.771Z
 * index 1 169 of 439 410957261049 59826 2026-03-18T10:09:15.552Z
 * index 1 170 of 439 412782282508 60095 2026-03-18T10:09:22.592Z
 * index 1 171 of 439 414844311459 60363 2026-03-18T10:09:30.129Z
 * index 1 172 of 439 416930337674 60630 2026-03-18T10:09:38.334Z
 * index 1 173 of 439 419016361584 60896 2026-03-18T10:09:46.502Z
 * index 1 174 of 439 421064385424 61161 2026-03-18T10:09:54.235Z
 * index 1 175 of 439 423112415362 61425 2026-03-18T10:10:01.665Z
 * index 1 176 of 439 424920444206 61688 2026-03-18T10:10:08.938Z
 * index 1 177 of 439 426728468334 61950 2026-03-18T10:10:16.167Z
 * index 1 178 of 439 428374490510 62211 2026-03-18T10:10:22.410Z
 * index 1 179 of 439 429955511080 62471 2026-03-18T10:10:28.495Z
 * index 1 180 of 439 431722535306 62730 2026-03-18T10:10:35.148Z
 * index 1 181 of 439 433252555174 62988 2026-03-18T10:10:41.107Z
 * index 1 182 of 439 434894575864 63245 2026-03-18T10:10:47.405Z
 * index 1 183 of 439 436674599560 63501 2026-03-18T10:10:54.579Z
 * index 1 184 of 439 438454620168 63756 2026-03-18T10:11:01.753Z
 * index 1 185 of 439 440203641842 64010 2026-03-18T10:11:08.440Z
 * index 1 186 of 439 441976667164 64263 2026-03-18T10:11:15.661Z
 * index 1 187 of 439 443749688181 64515 2026-03-18T10:11:22.844Z
 * index 1 188 of 439 445438707910 64766 2026-03-18T10:11:29.511Z
 * index 1 189 of 439 446944726801 65016 2026-03-18T10:11:35.413Z
 * index 1 190 of 439 448670749056 65265 2026-03-18T10:11:41.987Z
 * index 1 191 of 439 450396774231 65513 2026-03-18T10:11:48.535Z
 * index 1 192 of 439 452150795706 65760 2026-03-18T10:11:55.562Z
 * index 1 193 of 439 453646814403 66006 2026-03-18T10:12:01.577Z
 * index 1 194 of 439 455186833322 66251 2026-03-18T10:12:07.522Z
 * index 1 195 of 439 456785852346 66495 2026-03-18T10:12:13.632Z
 * index 1 196 of 439 458278870314 66738 2026-03-18T10:12:19.473Z
 * index 1 197 of 439 459875889734 66980 2026-03-18T10:12:25.554Z
 * index 1 198 of 439 461584912824 67221 2026-03-18T10:12:31.954Z
 * index 1 199 of 439 463293937749 67461 2026-03-18T10:12:38.337Z
 * index 1 200 of 439 465008959802 67700 2026-03-18T10:12:45.168Z
 * index 1 201 of 439 466489977372 67938 2026-03-18T10:12:51.131Z
 * index 1 202 of 439 468188997514 68175 2026-03-18T10:12:57.603Z
 * index 1 203 of 439 469893016230 68411 2026-03-18T10:13:04.455Z
 * index 1 204 of 439 471367033492 68646 2026-03-18T10:13:10.370Z
 * index 1 205 of 439 473067055591 68880 2026-03-18T10:13:17.320Z
 * index 1 206 of 439 474767075638 69113 2026-03-18T10:13:24.162Z
 * index 1 207 of 439 476442094531 69345 2026-03-18T10:13:30.469Z
 * index 1 208 of 439 478117114850 69576 2026-03-18T10:13:36.764Z
 * index 1 209 of 439 479803133431 69806 2026-03-18T10:13:43.441Z
 * index 1 210 of 439 481489150850 70035 2026-03-18T10:13:50.076Z
 * index 1 211 of 439 483150171557 70263 2026-03-18T10:13:56.297Z
 * index 1 212 of 439 484811195110 70490 2026-03-18T10:14:02.468Z
 * index 1 213 of 439 486483217395 70716 2026-03-18T10:14:09.107Z
 * index 1 214 of 439 488013233908 70941 2026-03-18T10:14:15.084Z
 * index 1 215 of 439 489453250145 71165 2026-03-18T10:14:20.776Z
 * index 1 216 of 439 490893266354 71388 2026-03-18T10:14:26.412Z
 * index 1 217 of 439 492429283340 71610 2026-03-18T10:14:32.272Z
 * index 1 218 of 439 493965300836 71831 2026-03-18T10:14:38.089Z
 * index 1 219 of 439 495615320422 72051 2026-03-18T10:14:44.604Z
 * index 1 220 of 439 497047336168 72270 2026-03-18T10:14:50.192Z
 * index 1 221 of 439 498678354635 72488 2026-03-18T10:14:56.313Z
 * index 1 222 of 439 500149370666 72705 2026-03-18T10:15:01.955Z
 * index 1 223 of 439 501783392475 72921 2026-03-18T10:15:08.486Z
 * index 1 224 of 439 503417410650 73136 2026-03-18T10:15:14.945Z
 * index 1 225 of 439 505051428029 73350 2026-03-18T10:15:21.434Z
 * index 1 226 of 439 506685444116 73563 2026-03-18T10:15:27.944Z
 * index 1 227 of 439 508286465065 73775 2026-03-18T10:15:33.920Z
 * index 1 228 of 439 509913484268 73986 2026-03-18T10:15:40.410Z
 * index 1 229 of 439 511318499063 74196 2026-03-18T10:15:46.072Z
 * index 1 230 of 439 512811514776 74405 2026-03-18T10:15:51.864Z
 * index 1 231 of 439 514401531286 74613 2026-03-18T10:15:57.827Z
 * index 1 232 of 439 515991549906 74820 2026-03-18T10:16:03.743Z
 * index 1 233 of 439 517594569568 75026 2026-03-18T10:16:10.065Z
 * index 1 234 of 439 519129584578 75231 2026-03-18T10:16:15.963Z
 * index 1 235 of 439 520706603560 75435 2026-03-18T10:16:21.841Z
 * index 1 236 of 439 522301620734 75638 2026-03-18T10:16:28.091Z
 * index 1 237 of 439 523896636190 75840 2026-03-18T10:16:34.306Z
 * index 1 238 of 439 525459652146 76041 2026-03-18T10:16:40.142Z
 * index 1 239 of 439 527047671607 76241 2026-03-18T10:16:46.421Z
 * index 1 240 of 439 528603688204 76440 2026-03-18T10:16:52.207Z
 * index 1 241 of 439 530159707102 76638 2026-03-18T10:16:57.937Z
 * index 1 242 of 439 531715727294 76835 2026-03-18T10:17:03.651Z
 * index 1 243 of 439 533282745155 77031 2026-03-18T10:17:09.793Z
 * index 1 244 of 439 534721758606 77226 2026-03-18T10:17:15.324Z
 * index 1 245 of 439 536078771789 77420 2026-03-18T10:17:20.630Z
 * index 1 246 of 439 537435784814 77613 2026-03-18T10:17:25.864Z
 * index 1 247 of 439 538878798573 77805 2026-03-18T10:17:31.278Z
 * index 1 248 of 439 540237817536 77996 2026-03-18T10:17:36.767Z
 * index 1 249 of 439 541596831119 78186 2026-03-18T10:17:42.194Z
 * index 1 250 of 439 542787843896 78375 2026-03-18T10:17:46.692Z
 * index 1 251 of 439 544025857698 78563 2026-03-18T10:17:51.386Z
 * index 1 252 of 439 545373872940 78750 2026-03-18T10:17:56.776Z
 * index 1 253 of 439 546721886620 78936 2026-03-18T10:18:02.154Z
 * index 1 254 of 439 547945899098 79121 2026-03-18T10:18:06.830Z
 * index 1 255 of 439 549087911336 79305 2026-03-18T10:18:11.206Z
 * index 1 256 of 439 550307924016 79488 2026-03-18T10:18:15.840Z
 * index 1 257 of 439 551612939332 79670 2026-03-18T10:18:20.731Z
 * index 1 258 of 439 552941955078 79851 2026-03-18T10:18:26.049Z
 * index 1 259 of 439 554270969028 80031 2026-03-18T10:18:31.322Z
 * index 1 260 of 439 555399980866 80210 2026-03-18T10:18:35.647Z
 * index 1 261 of 439 556528992629 80388 2026-03-18T10:18:39.958Z
 * index 1 262 of 439 557814008112 80565 2026-03-18T10:18:44.753Z
 * index 1 263 of 439 558951025099 80741 2026-03-18T10:18:49.438Z
 * index 1 264 of 439 559970037232 80916 2026-03-18T10:18:53.369Z
 * index 1 265 of 439 561070051204 81090 2026-03-18T10:18:57.570Z
 * index 1 266 of 439 562194066716 81263 2026-03-18T10:19:02.116Z
 * index 1 267 of 439 563318079466 81435 2026-03-18T10:19:06.707Z
 * index 1 268 of 439 564404092346 81606 2026-03-18T10:19:10.902Z
 * index 1 269 of 439 565521105356 81776 2026-03-18T10:19:15.456Z
 * index 1 270 of 439 566600119398 81945 2026-03-18T10:19:19.595Z
 * index 1 271 of 439 567679135780 82113 2026-03-18T10:19:23.709Z
 * index 1 272 of 439 568782149100 82280 2026-03-18T10:19:28.202Z
 * index 1 273 of 439 569697159549 82446 2026-03-18T10:19:31.726Z
 * index 1 274 of 439 570612169886 82611 2026-03-18T10:19:35.221Z
 * index 1 275 of 439 571527180264 82775 2026-03-18T10:19:38.695Z
 * index 1 276 of 439 572472190856 82938 2026-03-18T10:19:42.286Z
 * index 1 277 of 439 573456202453 83100 2026-03-18T10:19:46.050Z
 * index 1 278 of 439 574516217032 83261 2026-03-18T10:19:50.108Z
 * index 1 279 of 439 575589231896 83421 2026-03-18T10:19:54.491Z
 * index 1 280 of 439 576662243084 83580 2026-03-18T10:19:58.838Z
 * index 1 281 of 439 577629253475 83738 2026-03-18T10:20:02.537Z
 * index 1 282 of 439 578370263282 83895 2026-03-18T10:20:05.443Z
 * index 1 283 of 439 579250275022 84051 2026-03-18T10:20:08.942Z
 * index 1 284 of 439 580152289914 84206 2026-03-18T10:20:12.827Z
 * index 1 285 of 439 581054300971 84360 2026-03-18T10:20:16.681Z
 * index 1 286 of 439 581956311186 84513 2026-03-18T10:20:20.515Z
 * index 1 287 of 439 582815323206 84665 2026-03-18T10:20:24.009Z
 * index 1 288 of 439 583674337410 84816 2026-03-18T10:20:27.377Z
 * index 1 289 of 439 584562349203 84966 2026-03-18T10:20:31.179Z
 * index 1 290 of 439 585278358166 85115 2026-03-18T10:20:33.959Z
 * index 1 291 of 439 586056367579 85263 2026-03-18T10:20:37.046Z
 * index 1 292 of 439 586834377532 85410 2026-03-18T10:20:40.130Z
 * index 1 293 of 439 587559389885 85556 2026-03-18T10:20:43.457Z
 * index 1 294 of 439 588184398828 85701 2026-03-18T10:20:46.118Z
 * index 1 295 of 439 588872410905 85845 2026-03-18T10:20:49.018Z
 * index 1 296 of 439 589588423986 85988 2026-03-18T10:20:52.309Z
 * index 1 297 of 439 590304434352 86130 2026-03-18T10:20:55.587Z
 * index 1 298 of 439 590852442586 86271 2026-03-18T10:20:57.880Z
 * index 1 299 of 439 591458451501 86411 2026-03-18T10:21:00.432Z
 * index 1 300 of 439 592164462428 86550 2026-03-18T10:21:03.689Z
 * index 1 301 of 439 592706470419 86688 2026-03-18T10:21:05.962Z
 * index 1 302 of 439 593248478270 86825 2026-03-18T10:21:08.240Z
 * index 1 303 of 439 593790486195 86961 2026-03-18T10:21:10.516Z
 * index 1 304 of 439 594354494254 87096 2026-03-18T10:21:12.845Z
 * index 1 305 of 439 594947502538 87230 2026-03-18T10:21:15.332Z
 * index 1 306 of 439 595598512396 87363 2026-03-18T10:21:18.088Z
 * index 1 307 of 439 596249524180 87495 2026-03-18T10:21:20.828Z
 * index 1 308 of 439 596918535420 87626 2026-03-18T10:21:23.886Z
 * index 1 309 of 439 597503543619 87756 2026-03-18T10:21:26.335Z
 * index 1 310 of 439 598146552224 87885 2026-03-18T10:21:29.059Z
 * index 1 311 of 439 598802560675 88013 2026-03-18T10:21:32.038Z
 * index 1 312 of 439 599458568394 88140 2026-03-18T10:21:35.009Z
 * index 1 313 of 439 599974575494 88266 2026-03-18T10:21:37.170Z
 * index 1 314 of 439 600490582586 88391 2026-03-18T10:21:39.350Z
 * index 1 315 of 439 601113592070 88515 2026-03-18T10:21:41.979Z
 * index 1 316 of 439 601736602466 88638 2026-03-18T10:21:44.607Z
 * index 1 317 of 439 602370611137 88760 2026-03-18T10:21:47.481Z
 * index 1 318 of 439 603004618858 88881 2026-03-18T10:21:50.346Z
 * index 1 319 of 439 603506625670 89001 2026-03-18T10:21:52.444Z
 * index 1 320 of 439 604058632788 89120 2026-03-18T10:21:54.765Z
 * index 1 321 of 439 604682641642 89238 2026-03-18T10:21:57.603Z
 * index 1 322 of 439 605280649640 89355 2026-03-18T10:22:00.125Z
 * index 1 323 of 439 605897660213 89471 2026-03-18T10:22:02.944Z
 * index 1 324 of 439 606488669382 89586 2026-03-18T10:22:05.430Z
 * index 1 325 of 439 607098678243 89700 2026-03-18T10:22:08.196Z
 * index 1 326 of 439 607580684414 89813 2026-03-18T10:22:10.204Z
 * index 1 327 of 439 608186691758 89925 2026-03-18T10:22:12.950Z
 * index 1 328 of 439 608664697766 90036 2026-03-18T10:22:14.962Z
 * index 1 329 of 439 609186704216 90146 2026-03-18T10:22:17.139Z
 * index 1 330 of 439 609756713372 90255 2026-03-18T10:22:19.531Z
 * index 1 331 of 439 610345722640 90363 2026-03-18T10:22:22.198Z
 * index 1 332 of 439 610934729996 90470 2026-03-18T10:22:24.859Z
 * index 1 333 of 439 611399735643 90576 2026-03-18T10:22:26.792Z
 * index 1 334 of 439 611882741422 90681 2026-03-18T10:22:28.765Z
 * index 1 335 of 439 612433748515 90785 2026-03-18T10:22:31.096Z
 * index 1 336 of 439 612984756194 90888 2026-03-18T10:22:33.450Z
 * index 1 337 of 439 613550762236 90990 2026-03-18T10:22:36.017Z
 * index 1 338 of 439 614044767850 91091 2026-03-18T10:22:38.079Z
 * index 1 339 of 439 614538773563 91191 2026-03-18T10:22:40.154Z
 * index 1 340 of 439 615076779964 91290 2026-03-18T10:22:42.453Z
 * index 1 341 of 439 615416788063 91388 2026-03-18T10:22:44.221Z
 * index 1 342 of 439 615662792942 91485 2026-03-18T10:22:45.635Z
 * index 1 343 of 439 615908797850 91581 2026-03-18T10:22:47.021Z
 * index 1 344 of 439 616198803186 91676 2026-03-18T10:22:48.575Z
 * index 1 345 of 439 616531809344 91770 2026-03-18T10:22:50.302Z
 * index 1 346 of 439 616856816626 91863 2026-03-18T10:22:52.134Z
 * index 1 347 of 439 617093821209 91955 2026-03-18T10:22:53.483Z
 * index 1 348 of 439 617416828132 92046 2026-03-18T10:22:55.173Z
 * index 1 349 of 439 617730833741 92136 2026-03-18T10:22:56.959Z
 * index 1 350 of 439 618044838946 92225 2026-03-18T10:22:58.749Z
 * index 1 351 of 439 618358843826 92313 2026-03-18T10:23:00.534Z
 * index 1 352 of 439 618660849932 92400 2026-03-18T10:23:02.134Z
 * index 1 353 of 439 618936854399 92486 2026-03-18T10:23:03.718Z
 * index 1 354 of 439 619184858708 92571 2026-03-18T10:23:05.166Z
 * index 1 355 of 439 619398862859 92655 2026-03-18T10:23:06.397Z
 * index 1 356 of 439 619648867530 92738 2026-03-18T10:23:07.767Z
 * index 1 357 of 439 619942873208 92820 2026-03-18T10:23:09.452Z
 * index 1 358 of 439 620236877728 92901 2026-03-18T10:23:11.132Z
 * index 1 359 of 439 620509882346 92981 2026-03-18T10:23:12.584Z
 * index 1 360 of 439 620782887376 93060 2026-03-18T10:23:14.038Z
 * index 1 361 of 439 621055892899 93138 2026-03-18T10:23:15.486Z
 * index 1 362 of 439 621328896816 93215 2026-03-18T10:23:17.068Z
 * index 1 363 of 439 621594902925 93291 2026-03-18T10:23:18.501Z
 * index 1 364 of 439 621860908686 93366 2026-03-18T10:23:20.051Z
 * index 1 365 of 439 622126912928 93440 2026-03-18T10:23:21.601Z
 * index 1 366 of 439 622306916254 93513 2026-03-18T10:23:22.669Z
 * index 1 367 of 439 622486919548 93585 2026-03-18T10:23:23.744Z
 * index 1 368 of 439 622698923064 93656 2026-03-18T10:23:24.951Z
 * index 1 369 of 439 622950927434 93726 2026-03-18T10:23:26.475Z
 * index 1 370 of 439 623188931502 93795 2026-03-18T10:23:27.783Z
 * index 1 371 of 439 623426935893 93863 2026-03-18T10:23:29.117Z
 * index 1 372 of 439 623618938978 93930 2026-03-18T10:23:30.304Z
 * index 1 373 of 439 623799942082 93996 2026-03-18T10:23:31.374Z
 * index 1 374 of 439 623998945384 94061 2026-03-18T10:23:32.519Z
 * index 1 375 of 439 624223949084 94125 2026-03-18T10:23:33.885Z
 * index 1 376 of 439 624382951878 94188 2026-03-18T10:23:34.860Z
 * index 1 377 of 439 624603955882 94250 2026-03-18T10:23:36.212Z
 * index 1 378 of 439 624824958902 94311 2026-03-18T10:23:37.555Z
 * index 1 379 of 439 625022961776 94371 2026-03-18T10:23:38.762Z
 * index 1 380 of 439 625222964908 94430 2026-03-18T10:23:39.888Z
 * index 1 381 of 439 625435969529 94488 2026-03-18T10:23:41.167Z
 * index 1 382 of 439 625576972058 94545 2026-03-18T10:23:42.045Z
 * index 1 383 of 439 625717974522 94601 2026-03-18T10:23:42.921Z
 * index 1 384 of 439 625904978088 94656 2026-03-18T10:23:43.983Z
 * index 1 385 of 439 626102981932 94710 2026-03-18T10:23:45.187Z
 * index 1 386 of 439 626300984952 94763 2026-03-18T10:23:46.396Z
 * index 1 387 of 439 626498987762 94815 2026-03-18T10:23:47.608Z
 * index 1 388 of 439 626664991356 94866 2026-03-18T10:23:48.581Z
 * index 1 389 of 439 626787993482 94916 2026-03-18T10:23:49.375Z
 * index 1 390 of 439 626934995646 94965 2026-03-18T10:23:50.304Z
 * index 1 391 of 439 627071997765 95013 2026-03-18T10:23:51.138Z
 * index 1 392 of 439 627209000020 95060 2026-03-18T10:23:51.969Z
 * index 1 393 of 439 627365002527 95106 2026-03-18T10:23:52.878Z
 * index 1 394 of 439 627521005202 95151 2026-03-18T10:23:53.793Z
 * index 1 395 of 439 627680007223 95195 2026-03-18T10:23:54.796Z
 * index 1 396 of 439 627787009030 95238 2026-03-18T10:23:55.506Z
 * index 1 397 of 439 627933011255 95280 2026-03-18T10:23:56.373Z
 * index 1 398 of 439 628079014158 95321 2026-03-18T10:23:57.241Z
 * index 1 399 of 439 628220016191 95361 2026-03-18T10:23:58.154Z
 * index 1 400 of 439 628361018956 95400 2026-03-18T10:23:59.090Z
 * index 1 401 of 439 628454020488 95438 2026-03-18T10:23:59.739Z
 * index 1 402 of 439 628565022172 95475 2026-03-18T10:24:00.459Z
 * index 1 403 of 439 628696024551 95511 2026-03-18T10:24:01.326Z
 * index 1 404 of 439 628799026050 95546 2026-03-18T10:24:02.036Z
 * index 1 405 of 439 628884027489 95580 2026-03-18T10:24:02.641Z
 * index 1 406 of 439 628975028904 95613 2026-03-18T10:24:03.260Z
 * index 1 407 of 439 629086030934 95645 2026-03-18T10:24:03.959Z
 * index 1 408 of 439 629167032210 95676 2026-03-18T10:24:04.538Z
 * index 1 409 of 439 629276033618 95706 2026-03-18T10:24:05.274Z
 * index 1 410 of 439 629353034816 95735 2026-03-18T10:24:05.828Z
 * index 1 411 of 439 629440036080 95763 2026-03-18T10:24:06.410Z
 * index 1 412 of 439 629537037706 95790 2026-03-18T10:24:07.036Z
 * index 1 413 of 439 629634039588 95816 2026-03-18T10:24:07.658Z
 * index 1 414 of 439 629719040918 95841 2026-03-18T10:24:08.268Z
 * index 1 415 of 439 629790041917 95865 2026-03-18T10:24:08.796Z
 * index 1 416 of 439 629853042916 95888 2026-03-18T10:24:09.279Z
 * index 1 417 of 439 629935044138 95910 2026-03-18T10:24:09.828Z
 * index 1 418 of 439 629995045016 95931 2026-03-18T10:24:10.295Z
 * index 1 419 of 439 630065046054 95951 2026-03-18T10:24:10.794Z
 * index 1 420 of 439 630143047248 95970 2026-03-18T10:24:11.323Z
 * index 1 421 of 439 630221048746 95988 2026-03-18T10:24:11.866Z
 * index 1 422 of 439 630269049576 96005 2026-03-18T10:24:12.289Z
 * index 1 423 of 439 630317050493 96021 2026-03-18T10:24:12.710Z
 * index 1 424 of 439 630365051118 96036 2026-03-18T10:24:13.128Z
 * index 1 425 of 439 630413051695 96050 2026-03-18T10:24:13.546Z
 * index 1 426 of 439 630453052214 96063 2026-03-18T10:24:13.919Z
 * index 1 427 of 439 630498052809 96075 2026-03-18T10:24:14.299Z
 * index 1 428 of 439 630537053274 96086 2026-03-18T10:24:14.670Z
 * index 1 429 of 439 630564053685 96096 2026-03-18T10:24:14.980Z
 * index 1 430 of 439 630591054086 96105 2026-03-18T10:24:15.287Z
 * index 1 431 of 439 630623054675 96113 2026-03-18T10:24:15.610Z
 * index 1 432 of 439 630647055146 96120 2026-03-18T10:24:15.908Z
 * index 1 433 of 439 630667055397 96126 2026-03-18T10:24:16.185Z
 * index 1 434 of 439 630687055684 96131 2026-03-18T10:24:16.456Z
 * index 1 435 of 439 630707055936 96135 2026-03-18T10:24:16.735Z
 * index 1 436 of 439 630727056160 96138 2026-03-18T10:24:17.010Z
 * index 1 437 of 439 630729056198 96140 2026-03-18T10:24:17.203Z
 * index 1 438 of 439 630729056210 96141 2026-03-18T10:24:17.380Z
 * start 2026-03-18T09:42:50.795Z
 * nr_of_pairs 96141
 * 
 * Result Part 1 = 630729056210
 * Result Part 2 = 0
 */