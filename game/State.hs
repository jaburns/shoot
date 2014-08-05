module State (
    State(..)
  , Ball(..)
  , initialState
) where


import qualified Input as I


data State = State {
    paddles :: (Double,Double)
  , score :: (Int,Int)
  , ball :: Ball
  , savedInputs :: [[(String,I.Input)]]
} deriving (Show)

data Ball = Ball {
    x :: Double
  , y :: Double
  , vx :: Double
  , vy :: Double
} deriving (Show)


initialState :: State
initialState = State (0.1,0) (0,0) (Ball 0.1 0 0.03 0.025) []

