import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2023/day/10
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Pipe_Maze.js
 * 
 * Day 10: Pipe Maze
 *     0  R3C2    R2C3   - from R2C2   to R3C2    cur_pos_char F
 *     1  R2C2    R4C2   - from R2C2   to R4C2    cur_pos_char |
 *     2  R3C2    R4C3   - from R3C2   to R4C3    cur_pos_char L
 *     3  R4C4    R4C2   - from R4C2   to R4C4    cur_pos_char -
 *     4  R3C4    R4C3   - from R4C3   to R3C4    cur_pos_char J
 *     5  R2C4    R4C4   - from R4C4   to R2C4    cur_pos_char |
 *     6  R3C4    R2C3   - from R3C4   to R2C3    cur_pos_char 7
 *     7  R2C4    R2C2   - from R2C4   to R2C2    cur_pos_char -
 *     8                 - from R2C3   to         cur_pos_char S
 * 
 *   0  .......     0  .......     0  .......     0  AAAAAAA
 *   1  .......     1  .......     1  .......     1  AAAAAAA
 *   2  ..S-7..     2  ..S-7..     2  ..###..     2  AA###AA
 *   3  ..|.|..     3  ..|.|..     3  ..#.#..     3  AA#.#AA
 *   4  ..L-J..     4  ..L-J..     4  ..###..     4  AA###AA
 *   5  .......     5  .......     5  .......     5  AAAAAAA
 *   6  .......     6  .......     6  .......     6  AAAAAAA
 * 
 * Result Part 1 = 4.5
 * Result Part 2 = 1
 * 
 * ----------------------------------------------------------------------------
 * 
 *     0  R4C1    R3C2   - from R3C1   to R4C1    cur_pos_char F
 *     1  R3C1    R5C1   - from R3C1   to R5C1    cur_pos_char |
 *     2  R4C1    R5C2   - from R4C1   to R5C2    cur_pos_char L
 *     3  R4C2    R5C1   - from R5C1   to R4C2    cur_pos_char J
 *     4  R5C2    R4C3   - from R5C2   to R4C3    cur_pos_char F
 *     5  R4C4    R4C2   - from R4C2   to R4C4    cur_pos_char -
 *     6  R4C5    R4C3   - from R4C3   to R4C5    cur_pos_char -
 *     7  R3C5    R4C4   - from R4C4   to R3C5    cur_pos_char J
 *     8  R4C5    R3C4   - from R4C5   to R3C4    cur_pos_char 7
 *     9  R2C4    R3C5   - from R3C5   to R2C4    cur_pos_char L
 *    10  R1C4    R3C4   - from R3C4   to R1C4    cur_pos_char |
 *    11  R2C4    R1C3   - from R2C4   to R1C3    cur_pos_char 7
 *    12  R2C3    R1C4   - from R1C4   to R2C3    cur_pos_char F
 *    13  R1C3    R2C2   - from R1C3   to R2C2    cur_pos_char J
 *    14  R3C2    R2C3   - from R2C3   to R3C2    cur_pos_char F
 *    15  R2C2    R3C1   - from R2C2   to R3C1    cur_pos_char J
 *    16                 - from R3C2   to         cur_pos_char S
 * 
 *   0  .......     0  .......     0  .......     0  AAAAAAA
 *   1  .7-F7-.     1  ...F7..     1  ...##..     1  AAA##AA
 *   2  ..FJ|7.     2  ..FJ|..     2  ..###..     2  AA###AA
 *   3  .SJLL7.     3  .SJ.L7.     3  .##.##.     3  A##.##A
 *   4  .|F--J.     4  .|F--J.     4  .#####.     4  A#####A
 *   5  .LJ.LJ.     5  .LJ....     5  .##....     5  A##AAAA
 *   6  .......     6  .......     6  .......     6  AAAAAAA
 * 
 * 
 * Result Part 1 = 8.5
 * Result Part 2 = 1
 * 
 * ----------------------------------------------------------------------------
 * 
 *     0  R3C2    R2C3   - from R2C2   to R3C2    cur_pos_char F
 *     1  R2C2    R4C2   - from R2C2   to R4C2    cur_pos_char |
 *     2  R3C2    R5C2   - from R3C2   to R5C2    cur_pos_char |
 *     3  R4C2    R6C2   - from R4C2   to R6C2    cur_pos_char |
 *     4  R5C2    R7C2   - from R5C2   to R7C2    cur_pos_char |
 *     5  R6C2    R8C2   - from R6C2   to R8C2    cur_pos_char |
 *     6  R7C2    R8C3   - from R7C2   to R8C3    cur_pos_char L
 *     7  R8C4    R8C2   - from R8C2   to R8C4    cur_pos_char -
 *     8  R8C5    R8C3   - from R8C3   to R8C5    cur_pos_char -
 *     9  R7C5    R8C4   - from R8C4   to R7C5    cur_pos_char J
 *    10  R6C5    R8C5   - from R8C5   to R6C5    cur_pos_char |
 *    11  R7C5    R6C4   - from R7C5   to R6C4    cur_pos_char 7
 *    12  R6C5    R6C3   - from R6C5   to R6C3    cur_pos_char -
 *    13  R5C3    R6C4   - from R6C4   to R5C3    cur_pos_char L
 *    14  R4C3    R6C3   - from R6C3   to R4C3    cur_pos_char |
 *    15  R3C3    R5C3   - from R5C3   to R3C3    cur_pos_char |
 *    16  R4C3    R3C4   - from R4C3   to R3C4    cur_pos_char F
 *    17  R3C5    R3C3   - from R3C3   to R3C5    cur_pos_char -
 *    18  R3C6    R3C4   - from R3C4   to R3C6    cur_pos_char -
 *    19  R3C7    R3C5   - from R3C5   to R3C7    cur_pos_char -
 *    20  R3C8    R3C6   - from R3C6   to R3C8    cur_pos_char -
 *    21  R3C9    R3C7   - from R3C7   to R3C9    cur_pos_char -
 *    22  R4C9    R3C8   - from R3C8   to R4C9    cur_pos_char 7
 *    23  R3C9    R5C9   - from R3C9   to R5C9    cur_pos_char |
 *    24  R4C9    R6C9   - from R4C9   to R6C9    cur_pos_char |
 *    25  R5C9    R6C8   - from R5C9   to R6C8    cur_pos_char J
 *    26  R6C9    R6C7   - from R6C9   to R6C7    cur_pos_char -
 *    27  R7C7    R6C8   - from R6C8   to R7C7    cur_pos_char F
 *    28  R6C7    R8C7   - from R6C7   to R8C7    cur_pos_char |
 *    29  R7C7    R8C8   - from R7C7   to R8C8    cur_pos_char L
 *    30  R8C9    R8C7   - from R8C7   to R8C9    cur_pos_char -
 *    31  R8C10   R8C8   - from R8C8   to R8C10   cur_pos_char -
 *    32  R7C10   R8C9   - from R8C9   to R7C10   cur_pos_char J
 *    33  R6C10   R8C10  - from R8C10  to R6C10   cur_pos_char |
 *    34  R5C10   R7C10  - from R7C10  to R5C10   cur_pos_char |
 *    35  R4C10   R6C10  - from R6C10  to R4C10   cur_pos_char |
 *    36  R3C10   R5C10  - from R5C10  to R3C10   cur_pos_char |
 *    37  R2C10   R4C10  - from R4C10  to R2C10   cur_pos_char |
 *    38  R3C10   R2C9   - from R3C10  to R2C9    cur_pos_char 7
 *    39  R2C10   R2C8   - from R2C10  to R2C8    cur_pos_char -
 *    40  R2C9    R2C7   - from R2C9   to R2C7    cur_pos_char -
 *    41  R2C8    R2C6   - from R2C8   to R2C6    cur_pos_char -
 *    42  R2C7    R2C5   - from R2C7   to R2C5    cur_pos_char -
 *    43  R2C6    R2C4   - from R2C6   to R2C4    cur_pos_char -
 *    44  R2C5    R2C3   - from R2C5   to R2C3    cur_pos_char -
 *    45  R2C4    R2C2   - from R2C4   to R2C2    cur_pos_char -
 *    46                 - from R2C3   to         cur_pos_char S
 * 
 *   0  .............     0  .............     0  .............     0  AAAAAAAAAAAAA
 *   1  .............     1  .............     1  .............     1  AAAAAAAAAAAAA
 *   2  ..S-------7..     2  ..S-------7..     2  ..#########..     2  AA#########AA
 *   3  ..|F-----7|..     3  ..|F-----7|..     3  ..#########..     3  AA#########AA
 *   4  ..||.....||..     4  ..||.....||..     4  ..##.....##..     4  AA##AAAAA##AA
 *   5  ..||.....||..     5  ..||.....||..     5  ..##.....##..     5  AA##AAAAA##AA
 *   6  ..|L-7.F-J|..     6  ..|L-7.F-J|..     6  ..####.####..     6  AA####A####AA
 *   7  ..|..|.|..|..     7  ..|..|.|..|..     7  ..#..#.#..#..     7  AA#..#A#..#AA
 *   8  ..L--J.L--J..     8  ..L--J.L--J..     8  ..####.####..     8  AA####A####AA
 *   9  .............     9  .............     9  .............     9  AAAAAAAAAAAAA
 *  10  .............    10  .............    10  .............    10  AAAAAAAAAAAAA
 * 
 * 
 * Result Part 1 = 23.5
 * Result Part 2 = 4
 * 
 * ----------------------------------------------------------------------------
 * 
 *     0  R6C13   R5C14  - from R5C13  to R6C13   cur_pos_char F
 *     1  R5C13   R6C12  - from R5C13  to R6C12   cur_pos_char J
 *     2  R7C12   R6C13  - from R6C13  to R7C12   cur_pos_char F
 *     3  R6C12   R7C13  - from R6C12  to R7C13   cur_pos_char L
 *     4  R8C13   R7C12  - from R7C12  to R8C13   cur_pos_char 7
 *     5  R7C13   R8C12  - from R7C13  to R8C12   cur_pos_char J
 *     6  R9C12   R8C13  - from R8C13  to R9C12   cur_pos_char F
 *     7  R8C12   R10C12 - from R8C12  to R10C12  cur_pos_char |
 *     8  R9C12   R10C11 - from R9C12  to R10C11  cur_pos_char J
 *     9  R9C11   R10C12 - from R10C12 to R9C11   cur_pos_char L
 *    10  R8C11   R10C11 - from R10C11 to R8C11   cur_pos_char |
 *    11  R7C11   R9C11  - from R9C11  to R7C11   cur_pos_char |
 *    12  R6C11   R8C11  - from R8C11  to R6C11   cur_pos_char |
 *    13  R7C11   R6C10  - from R7C11  to R6C10   cur_pos_char 7
 *    14  R7C10   R6C11  - from R6C11  to R7C10   cur_pos_char F
 *    15  R6C10   R8C10  - from R6C10  to R8C10   cur_pos_char |
 *    16  R7C10   R8C9   - from R7C10  to R8C9    cur_pos_char J
 *    17  R7C9    R8C10  - from R8C10  to R7C9    cur_pos_char L
 *    18  R8C9    R7C8   - from R8C9   to R7C8    cur_pos_char 7
 *    19  R8C8    R7C9   - from R7C9   to R8C8    cur_pos_char F
 *    20  R7C8    R8C7   - from R7C8   to R8C7    cur_pos_char J
 *    21  R9C7    R8C8   - from R8C8   to R9C7    cur_pos_char F
 *    22  R8C7    R9C8   - from R8C7   to R9C8    cur_pos_char L
 *    23  R9C9    R9C7   - from R9C7   to R9C9    cur_pos_char -
 *    24  R10C9   R9C8   - from R9C8   to R10C9   cur_pos_char 7
 *    25  R9C9    R10C8  - from R9C9   to R10C8   cur_pos_char J
 *    26  R10C9   R10C7  - from R10C9  to R10C7   cur_pos_char -
 *    27  R10C8   R10C6  - from R10C8  to R10C6   cur_pos_char -
 *    28  R10C7   R10C5  - from R10C7  to R10C5   cur_pos_char -
 *    29  R9C5    R10C6  - from R10C6  to R9C5    cur_pos_char L
 *    30  R10C5   R9C6   - from R10C5  to R9C6    cur_pos_char F
 *    31  R8C6    R9C5   - from R9C5   to R8C6    cur_pos_char J
 *    32  R7C6    R9C6   - from R9C6   to R7C6    cur_pos_char |
 *    33  R8C6    R7C5   - from R8C6   to R7C5    cur_pos_char 7
 *    34  R6C5    R7C6   - from R7C6   to R6C5    cur_pos_char L
 *    35  R7C5    R6C6   - from R7C5   to R6C6    cur_pos_char F
 *    36  R6C7    R6C5   - from R6C5   to R6C7    cur_pos_char -
 *    37  R5C7    R6C6   - from R6C6   to R5C7    cur_pos_char J
 *    38  R6C7    R5C6   - from R6C7   to R5C6    cur_pos_char 7
 *    39  R4C6    R5C7   - from R5C7   to R4C6    cur_pos_char L
 *    40  R5C6    R4C5   - from R5C6   to R4C5    cur_pos_char 7
 *    41  R3C5    R4C6   - from R4C6   to R3C5    cur_pos_char L
 *    42  R4C5    R3C6   - from R4C5   to R3C6    cur_pos_char F
 *    43  R2C6    R3C5   - from R3C5   to R2C6    cur_pos_char J
 *    44  R3C6    R2C5   - from R3C6   to R2C5    cur_pos_char 7
 *    45  R2C6    R2C4   - from R2C6   to R2C4    cur_pos_char -
 *    46  R2C5    R2C3   - from R2C5   to R2C3    cur_pos_char -
 *    47  R3C3    R2C4   - from R2C4   to R3C3    cur_pos_char F
 *    48  R2C3    R4C3   - from R2C3   to R4C3    cur_pos_char |
 *    49  R3C3    R4C4   - from R3C3   to R4C4    cur_pos_char L
 *    50  R5C4    R4C3   - from R4C3   to R5C4    cur_pos_char 7
 *    51  R4C4    R5C3   - from R4C4   to R5C3    cur_pos_char J
 *    52  R5C4    R5C2   - from R5C4   to R5C2    cur_pos_char -
 *    53  R5C3    R5C1   - from R5C3   to R5C1    cur_pos_char -
 *    54  R4C1    R5C2   - from R5C2   to R4C1    cur_pos_char L
 *    55  R5C1    R4C2   - from R5C1   to R4C2    cur_pos_char F
 *    56  R3C2    R4C1   - from R4C1   to R3C2    cur_pos_char J
 *    57  R2C2    R4C2   - from R4C2   to R2C2    cur_pos_char |
 *    58  R1C2    R3C2   - from R3C2   to R1C2    cur_pos_char |
 *    59  R2C2    R1C3   - from R2C2   to R1C3    cur_pos_char F
 *    60  R1C4    R1C2   - from R1C2   to R1C4    cur_pos_char -
 *    61  R1C5    R1C3   - from R1C3   to R1C5    cur_pos_char -
 *    62  R1C6    R1C4   - from R1C4   to R1C6    cur_pos_char -
 *    63  R1C7    R1C5   - from R1C5   to R1C7    cur_pos_char -
 *    64  R2C7    R1C6   - from R1C6   to R2C7    cur_pos_char 7
 *    65  R1C7    R3C7   - from R1C7   to R3C7    cur_pos_char |
 *    66  R2C7    R4C7   - from R2C7   to R4C7    cur_pos_char |
 *    67  R3C7    R4C8   - from R3C7   to R4C8    cur_pos_char L
 *    68  R3C8    R4C7   - from R4C7   to R3C8    cur_pos_char J
 *    69  R2C8    R4C8   - from R4C8   to R2C8    cur_pos_char |
 *    70  R1C8    R3C8   - from R3C8   to R1C8    cur_pos_char |
 *    71  R2C8    R1C9   - from R2C8   to R1C9    cur_pos_char F
 *    72  R2C9    R1C8   - from R1C8   to R2C9    cur_pos_char 7
 *    73  R1C9    R3C9   - from R1C9   to R3C9    cur_pos_char |
 *    74  R2C9    R4C9   - from R2C9   to R4C9    cur_pos_char |
 *    75  R3C9    R4C10  - from R3C9   to R4C10   cur_pos_char L
 *    76  R3C10   R4C9   - from R4C9   to R3C10   cur_pos_char J
 *    77  R2C10   R4C10  - from R4C10  to R2C10   cur_pos_char |
 *    78  R1C10   R3C10  - from R3C10  to R1C10   cur_pos_char |
 *    79  R2C10   R1C11  - from R2C10  to R1C11   cur_pos_char F
 *    80  R2C11   R1C10  - from R1C10  to R2C11   cur_pos_char 7
 *    81  R1C11   R3C11  - from R1C11  to R3C11   cur_pos_char |
 *    82  R2C11   R4C11  - from R2C11  to R4C11   cur_pos_char |
 *    83  R3C11   R5C11  - from R3C11  to R5C11   cur_pos_char |
 *    84  R4C11   R5C12  - from R4C11  to R5C12   cur_pos_char L
 *    85  R4C12   R5C11  - from R5C11  to R4C12   cur_pos_char J
 *    86  R3C12   R5C12  - from R5C12  to R3C12   cur_pos_char |
 *    87  R2C12   R4C12  - from R4C12  to R2C12   cur_pos_char |
 *    88  R1C12   R3C12  - from R3C12  to R1C12   cur_pos_char |
 *    89  R2C12   R1C13  - from R2C12  to R1C13   cur_pos_char F
 *    90  R2C13   R1C12  - from R1C12  to R2C13   cur_pos_char 7
 *    91  R1C13   R3C13  - from R1C13  to R3C13   cur_pos_char |
 *    92  R2C13   R4C13  - from R2C13  to R4C13   cur_pos_char |
 *    93  R3C13   R4C14  - from R3C13  to R4C14   cur_pos_char L
 *    94  R3C14   R4C13  - from R4C13  to R3C14   cur_pos_char J
 *    95  R2C14   R4C14  - from R4C14  to R2C14   cur_pos_char |
 *    96  R1C14   R3C14  - from R3C14  to R1C14   cur_pos_char |
 *    97  R2C14   R1C15  - from R2C14  to R1C15   cur_pos_char F
 *    98  R1C16   R1C14  - from R1C14  to R1C16   cur_pos_char -
 *    99  R2C16   R1C15  - from R1C15  to R2C16   cur_pos_char 7
 *   100  R1C16   R2C15  - from R1C16  to R2C15   cur_pos_char J
 *   101  R3C15   R2C16  - from R2C16  to R3C15   cur_pos_char F
 *   102  R2C15   R3C16  - from R2C15  to R3C16   cur_pos_char L
 *   103  R4C16   R3C15  - from R3C15  to R4C16   cur_pos_char 7
 *   104  R3C16   R4C17  - from R3C16  to R4C17   cur_pos_char L
 *   105  R4C18   R4C16  - from R4C16  to R4C18   cur_pos_char -
 *   106  R5C18   R4C17  - from R4C17  to R5C18   cur_pos_char 7
 *   107  R4C18   R5C19  - from R4C18  to R5C19   cur_pos_char L
 *   108  R6C19   R5C18  - from R5C18  to R6C19   cur_pos_char 7
 *   109  R5C19   R6C20  - from R5C19  to R6C20   cur_pos_char L
 *   110  R7C20   R6C19  - from R6C19  to R7C20   cur_pos_char 7
 *   111  R6C20   R8C20  - from R6C20  to R8C20   cur_pos_char |
 *   112  R7C20   R8C19  - from R7C20  to R8C19   cur_pos_char J
 *   113  R7C19   R8C20  - from R8C20  to R7C19   cur_pos_char L
 *   114  R8C19   R7C18  - from R8C19  to R7C18   cur_pos_char 7
 *   115  R6C18   R7C19  - from R7C19  to R6C18   cur_pos_char L
 *   116  R7C18   R6C17  - from R7C18  to R6C17   cur_pos_char 7
 *   117  R5C17   R6C18  - from R6C18  to R5C17   cur_pos_char L
 *   118  R6C17   R5C16  - from R6C17  to R5C16   cur_pos_char 7
 *   119  R5C17   R5C15  - from R5C17  to R5C15   cur_pos_char -
 *   120  R6C15   R5C16  - from R5C16  to R6C15   cur_pos_char F
 *   121  R5C15   R6C16  - from R5C15  to R6C16   cur_pos_char L
 *   122  R7C16   R6C15  - from R6C15  to R7C16   cur_pos_char 7
 *   123  R6C16   R7C17  - from R6C16  to R7C17   cur_pos_char L
 *   124  R8C17   R7C16  - from R7C16  to R8C17   cur_pos_char 7
 *   125  R7C17   R9C17  - from R7C17  to R9C17   cur_pos_char |
 *   126  R8C17   R10C17 - from R8C17  to R10C17  cur_pos_char |
 *   127  R9C17   R10C16 - from R9C17  to R10C16  cur_pos_char J
 *   128  R9C16   R10C17 - from R10C17 to R9C16   cur_pos_char L
 *   129  R8C16   R10C16 - from R10C16 to R8C16   cur_pos_char |
 *   130  R9C16   R8C15  - from R9C16  to R8C15   cur_pos_char 7
 *   131  R9C15   R8C16  - from R8C16  to R9C15   cur_pos_char F
 *   132  R8C15   R10C15 - from R8C15  to R10C15  cur_pos_char |
 *   133  R9C15   R10C14 - from R9C15  to R10C14  cur_pos_char J
 *   134  R9C14   R10C15 - from R10C15 to R9C14   cur_pos_char L
 *   135  R8C14   R10C14 - from R10C14 to R8C14   cur_pos_char |
 *   136  R7C14   R9C14  - from R9C14  to R7C14   cur_pos_char |
 *   137  R6C14   R8C14  - from R8C14  to R6C14   cur_pos_char |
 *   138  R5C14   R7C14  - from R7C14  to R5C14   cur_pos_char |
 *   139  R6C14   R5C13  - from R6C14  to R5C13   cur_pos_char 7
 *   140                 - from R5C14  to         cur_pos_char S
 * 
 *   0  ......................     0  ......................     0  ......................     0  AAAAAAAAAAAAAAAAAAAAAA
 *   1  ..F----7F7F7F7F-7.....     1  ..F----7F7F7F7F-7.....     1  ..###############.....     1  AA###############AAAAA
 *   2  ..|F--7||||||||FJ.....     2  ..|F--7||||||||FJ.....     2  ..###############.....     2  AA###############AAAAA
 *   3  ..||.FJ||||||||L7.....     3  ..||.FJ||||||||L7.....     3  ..##.############.....     3  AA##.############AAAAA
 *   4  .FJL7L7LJLJ||LJ.L-7...     4  .FJL7L7LJLJ||LJ.L-7...     4  .##############.###...     4  A##############.###AAA
 *   5  .L--J.L7...LJS7F-7L7..     5  .L--J.L7...LJS7F-7L7..     5  .####.##...#########..     5  A####.##...#########AA
 *   6  .....F-J..F7FJ|L7L7L7.     6  .....F-J..F7FJ|L7L7L7.     6  .....###..###########.     6  AAAAA###..###########A
 *   7  .....L7.F7||L7|.L7L7|.     7  .....L7.F7||L7|.L7L7|.     7  .....##.#######.#####.     7  AAAAA##.#######.#####A
 *   8  ......|FJLJ|FJ|F7|.LJ.     8  ......|FJLJ|FJ|F7|.LJ.     8  ......############.##.     8  AAAAAA############A##A
 *   9  .....FJL-7.||.||||....     9  .....FJL-7.||.||||....     9  .....#####.##.####....     9  AAAAA#####A##A####AAAA
 *  10  .....L---J.LJ.LJLJ....    10  .....L---J.LJ.LJLJ....    10  .....#####.##.####....    10  AAAAA#####A##A####AAAA
 *  11  ......................    11  ......................    11  ......................    11  AAAAAAAAAAAAAAAAAAAAAA
 * 
 * 
 * Result Part 1 = 70.5
 * Result Part 2 = 10
 * 
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
const TILE_PATH                          : string = "#";
const TILE_FLOOD_FILL                    : string = "A";

const STR_COMBINE_SPACER                 : string = "   "; 


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
        str_result += pad( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? TILE_FLOOR;
        }

        str_result += "\n";
    }

    return str_result;
}


function countTiles( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number, pTile : string  ): number
{
    let count_tile : number = 0;

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pHashMap[ "R" + cur_row  + "C" + cur_col  ] ?? TILE_FLOOR ) == pTile )
            {
                count_tile++;
            }
        }
    }

    return count_tile;
}


function floodFill( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number, pRow : number, pCol : number  ): void
{
    if ( pRow >= pMaxRows ) return;
    if ( pCol >= pMaxCols ) return;

    if ( pRow < 0 ) return;
    if ( pCol < 0 ) return;

    if ( ( pHashMap[ "R" + pRow  + "C" + pCol ] ?? TILE_FLOOR ) === TILE_FLOOD_FILL ) return;
    if ( ( pHashMap[ "R" + pRow  + "C" + pCol ] ?? TILE_FLOOR ) === TILE_PATH       ) return;

    pHashMap[ "R" + pRow  + "C" + pCol ] = TILE_FLOOD_FILL;

    floodFill( pHashMap, pMaxRows, pMaxCols, pRow - 1, pCol );
    floodFill( pHashMap, pMaxRows, pMaxCols, pRow + 1, pCol );
    floodFill( pHashMap, pMaxRows, pMaxCols, pRow, pCol - 1 );
    floodFill( pHashMap, pMaxRows, pMaxCols, pRow, pCol + 1 );
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ): void 
{
    /*
     * *******************************************************************************************************
     * Initializing the grid
     * *******************************************************************************************************
     */
    let map_input : PropertieMap = {};

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows : number = 1; // for Part 2, the start of the input rows starts at 1
    let grid_cols : number = 0;

    let grid_start_row : number = -1;
    let grid_start_col : number = -1;

    for ( const cur_input_str of pArray ) 
    {
        let cur_modified_input_str = TILE_FLOOR + cur_input_str + TILE_FLOOR; // for part 2

        for ( let cur_col1 = 0; cur_col1 < cur_modified_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_modified_input_str[ grid_cols ] ?? ".";

            let hash_map_key = "R" + grid_rows + "C" + grid_cols;

            map_input[ hash_map_key ] = cur_char_input;

            if ( cur_char_input == TILE_START_POSITION )
            {
                grid_start_row = grid_rows;

                grid_start_col = cur_col1;
            }
        }

        grid_rows++;
    }

    grid_rows++; // for part 2
    grid_cols++;

    /*
     * *******************************************************************************************************
     * Traversing the grid
     * *******************************************************************************************************
     */
    let map_path_debug : PropertieMap = {};
    let map_path_part2 : PropertieMap = {};


    if ( ( grid_start_row >= 0) && ( grid_start_col >= 0) )
    {
        let cur_pos_char : string = getStartTileChar( map_input, grid_start_row, grid_start_col );;

        let coords_cur  : string = "R" + grid_start_row  + "C" + grid_start_col;
        let coords_from : string = coords_cur;
        let coords_to   : string = coords_cur;

        let coords_1 : string = "";
        let coords_2 : string = "";

        let count_nr : number = 0; 

        let row_cur : number = grid_start_row;
        let col_cur : number = grid_start_col;

        while (( cur_pos_char !== TILE_START_POSITION ) && ( count_nr < 100000) ) 
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
            cur_pos_char = ( map_input[ coords_cur ] ?? TILE_NOT_GRID );
            }

            map_path_debug[ coords_cur] = cur_pos_char;
            map_path_part2[ coords_cur] = TILE_PATH;

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

            if ( pKnzDebug )
            {
                console.log( pad( count_nr, 5 ) + "  " + padR( coords_1, 6 ) + "  " + padR( coords_2, 6 ) + " - from " + padR(  coords_from, 6 ) + " to " + padR( coords_to, 6  ) + "  cur_pos_char " + cur_pos_char );
            }

            coords_from = coords_cur;

            coords_cur = coords_to;

            count_nr++;
        }

        result_part_01 = ( count_nr / 2);
    }

    //writeFile( "/home/ea234/typescript/debug_map_day10_a.txt", getDebugMap( t_map, grid_rows, grid_cols ) );

    let str_debug_combined_maps : string = "";

    if ( pKnzDebug )
    {
        let str_temp : string = combineStrings( getDebugMap( map_input, grid_rows, grid_cols ), getDebugMap( map_path_debug, grid_rows, grid_cols ) );

        str_debug_combined_maps = combineStrings( str_temp, getDebugMap( map_path_part2, grid_rows, grid_cols ) );
    }

    /*
     * *******************************************************************************************************
     * Flood-Fill for all non visited Tiles
     * *******************************************************************************************************
     */
    floodFill( map_path_part2, grid_rows, grid_cols, 0, 0 );

    //writeFile( "/home/ea234/typescript/debug_map_day10_b.txt", getDebugMap( map_path_part2, grid_rows, grid_cols ) );

    result_part_02 = countTiles( map_path_part2, grid_rows, grid_cols, TILE_FLOOR );

    if ( pKnzDebug )
    {
        console.log( "" );
        console.log( combineStrings( str_debug_combined_maps, getDebugMap( map_path_part2, grid_rows, grid_cols ) ) );
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


function getTestArray3(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "..........." );
    array_test.push( ".S-------7." );
    array_test.push( ".|F-----7|." );
    array_test.push( ".||.....||." );
    array_test.push( ".||.....||." );
    array_test.push( ".|L-7.F-J|." );
    array_test.push( ".|..|.|..|." );
    array_test.push( ".L--J.L--J." );
    array_test.push( "..........." );

    return array_test;
}


function getTestArray4(): string[] 
{
    const array_test: string[] = [];

    array_test.push( ".F----7F7F7F7F-7...." );
    array_test.push( ".|F--7||||||||FJ...." );
    array_test.push( ".||.FJ||||||||L7...." );
    array_test.push( "FJL7L7LJLJ||LJ.L-7.." );
    array_test.push( "L--J.L7...LJS7F-7L7." );
    array_test.push( "....F-J..F7FJ|L7L7L7" );
    array_test.push( "....L7.F7||L7|.L7L7|" );
    array_test.push( ".....|FJLJ|FJ|F7|.LJ" );
    array_test.push( "....FJL-7.||.||||..." );
    array_test.push( "....L---J.LJ.LJLJ..." );

    return array_test;
}


function getTestArray5(): string[] 
{
    const array_test: string[] = [];

    array_test.push( "FF7FSF7F7F7F7F7F---7" );
    array_test.push( "L|LJ||||||||||||F--J" );
    array_test.push( "FL-7LJLJ||||||LJL-77" );
    array_test.push( "F--JF--7||LJLJ7F7FJ-" );
    array_test.push( "L---JF-JLJ.||-FJLJJ7" );
    array_test.push( "|F|F-JF---7F7-L7L|7|" );
    array_test.push( "|FFJF7L7F-JF7|JL---7" );
    array_test.push( "7-L-JL7||F7|L7F-7F7|" );
    array_test.push( "L.L7LFJ|||||FJL7||LJ" );
    array_test.push( "L7JLJL-JLJLJL--JLJ.L" );

    return array_test;
}


console.log( "Day 10: Pipe Maze" );

//calcArray( getTestArray1() );
//calcArray( getTestArray2() );
//calcArray( getTestArray3() );
calcArray( getTestArray4() );

//checkReaddatei();
