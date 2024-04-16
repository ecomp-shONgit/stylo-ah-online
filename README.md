# stylo-ah-online
stylo ah online is a online tool to compute comparative text analysis in your browser. It implements the pipeline consisting of text (string) normalization, string decomposition (into token / features), counting and building up a feature vector, measure computation (create a distance matrix) and clustering. 


# Usage

Manual: [in german language]([manual/README.md](http://replicatio.science/dokuwiki/doku.php/de/styloahonline/handbuch))
Online tool: [stylo-ah-online](http://replicatio.science/~khk/styloonline/) 

# Installation

You may run the website on your own server. To do so, you need the index.HTML in place and in the same folder the interfff.JS, also you have to link against some libraries that are also present in this github account. The libraries are "svgdrawinglib.js", ["textnorm.js"](https://github.com/ecomp-shONgit/text-normalisation), ["strdist.js"](https://github.com/ecomp-shONgit/string-distance), ["textdecomp.js"](https://github.com/ecomp-shONgit/text-decomtrans), ["vecspmeasures.js"](https://github.com/ecomp-shONgit/vector-measures) and ["clust.js"](https://github.com/ecomp-shONgit/cluster-and-embed). There is no third party implementation needed.
