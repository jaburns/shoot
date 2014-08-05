module Player (
    stepPlayer
) where


import qualified State as S
import qualified Input as I


addPair :: Num a => (a,a) -> (a,a) -> (a,a)
addPair (a,b) (c,d) = (a+c, b+d)

stepPlayer :: I.Input -> S.Player -> S.Player
stepPlayer i p = p {
    S.playerPos = addPair (S.playerPos p) (S.playerVel p),
  , S.playerVel = if (I.pressed $ I.left i)
                then (-1, snd $ S.playerVel p)
             else if (I.pressed $ I.right i)
                then ( 1, snd $ S.playerVel p)
                else ( 0, snd $ S.playerVel p)
  , S.playerStanding = False
}
