//
// IA.hh for gomoku in /home/muzika_a/rendu/Tek3/IA
// 
// Made by adrien muzika
// Login   <muzika_a@epitech.net>
// 
// Started on  Mon Oct 24 15:49:05 2016 adrien muzika
// Last update Mon Oct 24 16:39:42 2016 adrien muzika
//

#ifndef IA_HH_
# define IA_HH_

namespace	gomoku
{
  enum class	TileType
  {
    EMPTY_TILE	= 0,
    P1_TILE	= 1,
    P2_TILE	= 2
  };

  enum class	GameState
  {
    WON		= 0,
    ONGOING	= 1,
    BROKEN_FIVE	= 2
    // partie normalement gagné mais les cinq pions gagnant peuvent être "cassé" au prochain coup
  };

  struct	GetMap
  {
    int		width;
    int		length;
    TileType	tile[0];
  };
}

class	Game
{
private:
  gomoku::GetMap	*map;
  gomoku::GameState	state;
  int			count_p1;
  int			count_p2;
public:
  Game(void);
  ~Game(void);
  gomoku::GetMap	getField(void) const;
  gomoku::GameState	getState(void) const;
  int			getCount(int player) const;

  // ChangeTile renvoie int ->
  // 0 = ne peux pas placer
  // 1 = placement successful
  // 2 = placement gagne la partie
  int			changeTile(int x, int y, int playerNum);
  void			initMap(void);
};

# endif /* !IA_HH_ */
