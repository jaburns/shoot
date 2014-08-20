I'm actively deving this repo as well as ``node-gamesync`` so I just added
it as a submodule instead of using ``pacakge.json`` so I could work on them both easily.

```sh
#setup
git clone https://github.com/jaburns/uni
cd uni
git submodule update --init
cd node_modules/gamesync
npm install
cd ../..
node .
```
