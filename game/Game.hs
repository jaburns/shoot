module Game (
    game
) where


import qualified State as S
import qualified Input as I


data Game i s = Game {
    dt :: Int
  , players :: Int
  , initialState :: s
  , defaultInput :: i
  , step :: [(String,i)] -> s -> s
}

game :: Game I.Input S.State
game = Game {
    dt = 50
  , players = 2
  , initialState = S.initialState
  , defaultInput = I.defaultInput
  , step = mainStep
}


mainStep :: [(String,I.Input)] -> S.State -> S.State
mainStep i s = s
