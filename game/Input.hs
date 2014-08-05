module Input (
    Input(..)
  , defaultInput
) where


data Input = Input {
    paddle :: Double
} deriving (Show)


defaultInput :: Input
defaultInput = Input 0

