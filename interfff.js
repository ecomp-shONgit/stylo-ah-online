//******************************************************************************
//
// 2023 stylo-online tool text normalization / decomposition / counting / measuring / clustering
// Author: Prof. Ch. Schubert, KHK
// Frontend to the textnorm / text decomposition (features) / measures / cluster libraries. 
// Input txt via select files (txt, xml) to save the input to RAM, DB and file
// Fokused on easy use and replication
//******************************************************************************

/*
GPLv3 copyrigth

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

/*GLOBAL VARS*/
const durationbetweenautosave = 1000;
const durationbetweendownloads = 500;
const displen = 1000;
let fnames = [];
let rawinp = {};
let normedts = {};
let decompts = {};
let countsts = {};
let profiles = {}; 
let dmts = [];
let clusters = null;
let lastchangeokk = 7;//  1:norm, 2:decomp, 3:counting, 4:measure, 5:clustering, 6:export, 7:none

const defaultstops = "%N%;;†;;';;~;;⋖;;A;;ex.;;fr.;;p.;;v.;;α;;Α;;ἃ;;αʹ;;ἀεὶ;;αἱ;;ἀλλ';;Ἀλλ';;ἀλλὰ;;Ἀλλὰ;;ἄλλα;;ἀλλήλων;;ἄλλο;;ἄλλοι;;ἄλλοις;;ἄλλος;;ἄλλων;;ἄλλως;;ἅμα;;ἄν;;ἂν;;ἄνευ;;ἀντὶ;;ἄνω;;ἀπ';;ἅπαντα;;ἁπάντων;;ἁπλῶς;;ἀπό;;ἀπὸ;;ἄρα;;αὖ;;αὖθις;;αὐτὰ;;αὐτὴ;;αὐτῇ;;αὕτη;;αὐτὴν;;αὐτῆς;;αὐτὸ;;αὐτοὶ;;αὐτοῖς;;αὐτόν;;αὐτὸν;;αὐτός;;αὐτὸς;;αὐτοῦ;;αὐτούς;;αὐτοὺς;;αὐτῷ;;αὐτῶν;;ἀϕ';;Β;;βʹ;;Γ;;γʹ;;γάρ;;γὰρ;;γε;;γέγονεν;;γενέσθαι;;γίνεται;;γίνονται;;δʹ;;δ';;δαί;;δαίς;;δέ;;δὲ;;δεῖ;;δεύτερον;;δή;;δὴ;;δηλοῖ;;δῆλον;;δι';;διά;;διὰ;;Διὰ;;διὸ;;διότι;;δύναται;;δύο;;ε;;ἐάν;;ἐὰν;;ἑαυτὸν;;ἑαυτοῦ;;ἑαυτῷ;;ἑαυτῶν;;ἐγώ;;ἐγὼ;;εἰ;;Εἰ;;εἴ;;εἴη;;εἰμί;;εἶναι;;εἴπερ;;εἰς;;εἷς;;εἰσι;;εἰσὶ;;εἰσιν;;εἶτα;;εἴτε;;ἐκ;;ἕκαστον;;ἐκεῖ;;ἐκεῖνο;;ἐκεῖνον;;ἐκεῖνος;;ἐκείνου;;ἐκείνων;;ἐμοὶ;;εμον;;ἐμός;;εμου;;ἐμοῦ;;ἐν;;Ἐν;;ἓν;;ἕνα;;ἔνθα;;ἑνὸς;;ἐνταῦθα;;ἐντεῦθεν;;ἐξ;;ἔξω;;ἐπ';;ἐπεὶ;;ἐπειδὴ;;ἔπειτα;;ἐπί;;ἐπὶ;;ἐς;;ἔσται;;ἐστι;;ἐστὶ;;ἔστι;;ἐστίν;;ἐστὶν;;ἔστιν;;ἕτερον;;ἔτη;;ἔτι;;εὖ;;εὐθὺς;;ἐϕ';;ἔχει;;ἔχειν;;ἔχον;;ἔχοντα;;ἔχοντες;;ἔχων;;ἕως;;ἢ;;ᾖ;;ἡ;;Ἡ;;ᾗ;;ἤγουν;;ἤδη;;ἡμᾶς;;ἡμεῖς;;ἡμῖν;;ἡμῶν;;ην;;ἦν;;ἣν;;ης;;ἧς;;ἦσαν;;ἤτοι;;ι;;ἴδιον;;ἵνα;;καθ';;καθάπερ;;καί;;καὶ;;Καὶ;;καίτοι;;κἂν;;κατ';;κατά;;κατὰ;;κάτω;;λοιπὸν;;μάλιστα;;μᾶλλον;;με;;μέγα;;μεθ';;μέν;;μὲν;;μέντοι;;μετ';;μετά;;μετὰ;;μεταξὺ;;μέχρι;;μή;;μὴ;;Μὴ;;μηδὲ;;μηδὲν;;μὴν;;μήτε;;μίαν;;μοι;;μόνον;;μου;;ν;;νοῦν;;νῦν;;ὁ;;Ὁ;;ὅ;;ὃ;;ὅδε;;ὅθεν;;οἱ;;Οἱ;;οἳ;;οἶμαι;;οἷον;;οἷς;;ὅλως;;ὁμοίως;;ὁμοῦ;;ὅμως;;ὂν;;ὃν;;ὄντα;;ὄντος;;ὄντων;;ὅπερ;;ὅπως;;ὅς;;ὃς;;ὅσα;;ὅσον;;ὅστις;;ὅταν;;ὅτε;;ὅτι;;Ὅτι;;οὐ;;Οὐ;;οὗ;;οὐδ';;οὐδέ;;οὐδὲ;;οὐδείς;;οὐδεὶς;;οὐδὲν;;οὐκ;;Οὐκ;;οὐκέτι;;οὖν;;οὓς;;οὐσίαν;;οὐσίας;;οὔτε;;οὗτοι;;οὗτος;;οὕτω;;οὕτως;;οὐχ;;οὐχὶ;;πάλιν;;πᾶν;;πάντα;;πάντας;;πάντες;;παντὶ;;παντὸς;;πάντων;;πάντως;;πάνυ;;παρ';;παρά;;παρὰ;;πᾶσα;;πᾶσαν;;πάσης;;πᾶσι;;πᾶσιν;;περί;;περὶ;;Περὶ;;πλέον;;πλῆθος;;πλὴν;;πολλὰ;;πολλάκις;;πολλοὶ;;πολλοὺς;;πολλῷ;;πολλῶν;;πολὺ;;ποτε;;ποτὲ;;που;;πρὶν;;πρὸ;;πρός;;πρὸς;;πρότερον;;πρῶτον;;πῶς;;σε;;σοι;;σός;;σου;;σοῦ;;σύ;;σὺ;;σύν;;σὺν;;τ';;τά;;τὰ;;Τὰ;;ταῖς;;τὰς;;ταῦτα;;Ταῦτα;;ταύτῃ;;ταύτην;;ταύτης;;τε;;τῇ;;τήν;;τὴν;;της;;τῆς;;τῆϲ;;τι;;τί;;Τί;;τινα;;τινὰ;;τινες;;τινος;;τινὸς;;τις;;τίς;;τό;;τὸ;;Τὸ;;τοι;;τοί;;τοιαῦτα;;τοίνυν;;τοιοῦτον;;τοιοῦτος;;τοιούτων;;τοῖς;;τόν;;τὸν;;τόπον;;τοσοῦτον;;τότε;;τοῦ;;τους;;τοὺς;;τοῦτ';;τουτέστι;;τουτέστιν;;τοῦτο;;τούτοις;;τοῦτον;;τούτου;;τούτους;;τούτῳ;;τούτων;;τρεῖς;;τῷ;;τῶν;;ὑμᾶς;;ὑμῖν;;ὑμός;;ὑμῶν;;ὑπ';;ὑπέρ;;ὑπὲρ;;ὑπό;;ὑπὸ;;ὕστερον;;ϕησὶν;;χρὴ;;χωρὶς;;ὦ;;ὢν;;ὧν;;ὡσ;;ὡς;;ὥς;;ὥσπερ;;ὥστε;;CRITICAL;;ABBREVIATIONS;;abiud;;add;;adesp;;al;;ant;;antec;;anteced;;antecedent;;anth;;app;;arg;;argum;;argument;;art;;artic;;ca;;cap;;capit;;capitul;;cert;;cet;;cett;;cf;;ci;;cit;;cj;;cl;;cod;;codd;;col;;coll;;coni;;conj;;cont;;corp;;corr;;damn;;def;;del;;dett;;dist;;distin;;distinc;;distinct;;dub;;ead;;eadem;;ed;;edd;;eiusd;;ejusd;;em;;eod;;epist;;etc;;exp;;fg;;fgs;;fin;;fort;;fr;;frg;;gl;;gr;;ib;;ibid;;il;;ill;;indic;;inf;;infr;;init;;inscr;;interl;;lect;;lit;;litt;;ll;;loc;;marg;;mg;;ms;;mss;;mut;;od;;om;;pag;;pal;;pap;;papp;;penul;;penult;;pler;;plur;;pot;;pp;;pr;;praec;;praeced;;prob;;prolog;;prooem;;prop;;propos;;qq;;qu;;quaest;;quaestiunc;;quaestiuncul;;ras;;recc;;rell;;respons;;sc;;schol;;scholl;;scil;;secl;;seq;;seqq;;sim;;solut;;sq;;sqq;;ss;;subscr;;sup;;suppl;;susp;;tent;;text;;trai;;transp;;transt;;trib;;ud;;uers;;uersic;;uett;;uid;;uit;;ult;;ultim;;uu;;uulg;;vd;;vers;;versic;;vett;;vid;;vit;;vulg;;vv;;γρ;;agr;;ap;;cn;;mam;;oct;;opet;;pro;;ser;;sert;;sex;;st;;ti;;uol;;uop;;vol;;vop;;CONJUNCTIONS;;ac;;an;;antequam;;at;;atque;;aut;;autem;;donec;;dum;;enim;;ergo;;et;;etenim;;etiam;;etiamsi;;etsi;;igitur;;itaque;;licet;;nam;;namque;;ne;;nec;;necque;;neque;;ni;;nisi;;postquam;;proinde;;quamobrem;;quamquam;;quanquam;;quare;;que;;quia;;quomodo;;quoniam;;quoque;;sed;;seu;;si;;sin;;siue;;sive;;tamen;;tametsi;;ue;;uel;;ut;;utcunque;;uterque;;uti;;utlibet;;utne;;utque;;utraque;;utrum;;utrumque;;utue;;utve;;ve;;vel;;PREPOSITIONS;;ab;;abs;;ad;;aduersum;;aduersus;;adversum;;adversus;;ante;;apud;;circa;;circum;;contra;;coram;;cum;;de;;erga;;ex;;extra;;in;;infra;;inter;;intra;;ob;;penes;;per;;post;;prae;;praeter;;prope;;propter;;secundum;;sine;;sub;;subter;;super;;supra;;tenus;;trans;;ultra;;adeo;;adhuc;;aliquando;;aliter;;antea;;certe;;ceterum;;cur;;dein;;deinde;;demum;;denique;;diu;;ecce;;equidem;;fere;;forsitan;;fortasse;;forte;;frustra;;hactenus;;haud;;hinc;;hodie;;huc;;iam;;iamque;;ibi;;ideo;;illic;;immo;;inde;;interdum;;interim;;ita;;item;;iterum;;iuxta;;jam;;jamque;;juxta;;magis;;minime;;minus;;minusne;;minusque;;minusue;;minusve;;modo;;mox;;nihilo;;nimirum;;nimis;;non;;nondum;;nonne;;num;;numquam;;nunc;;olim;;omnino;;paene;;pariter;;plane;;plerumque;;plus;;plusne;;plusque;;plusue;;plusve;;postea;;potius;;praesertim;;praeterea;;primum;;prius;;priusquam;;procul;;profecto;;protinus;;qualibet;;quam;;quando;;quasi;;quatenus;;quemadmodum;;quidem;;quin;;quippe;;quodam;;quodammodo;;quolibet;;quondam;;quot;;quotiens;;repente;;rursum;;rursus;;saepe;;sane;;sat;;satis;;scilicet;;semel;;semper;;sic;;sicut;;sicuti;;simul;;solum;;sponte;;statim;;tam;;tamquam;;tandem;;tantum;;tantummodo;;tot;;totiens;;tum;;tunc;;ubi;;uelut;;uero;;uidelicet;;uix;;ultro;;umquam;;unde;;undique;;usque;;utique;;velut;;vero;;videlicet;;vix;;ego;;egon;;egone;;egoque;;me;;mecum;;mecumque;;mecumst;;med;;medem;;mei;;mein;;meique;;meme;;memet;;men;;mene;;meque;;mest;;mi;;mihi;;mihin;;mihine;;mihique;;mihist;;min;;mine;;mist;;meus;;mea;;meae;;meaeque;;meai;;meam;;meamne;;meamque;;mean;;meane;;meaque;;mearum;;mearumque;;meas;;measque;;meast;;mee;;meis;;meisque;;meo;;meon;;meone;;meoque;;meost;;meum;;meumque;;meumst;;meumve;;meusque;;meust;;tu;;te;;tecum;;tecumque;;ted;;temet;;ten;;tenve;;tenveque;;tenvis;;teque;;test;;teve;;tibi;;tibimet;;tibin;;tibique;;tibist;;tui;;tuin;;tuine;;tuique;;tun;;tune;;tuque;;tute;;tutemet;;tuus;;tua;;tuae;;tuaen;;tuaeque;;tuaest;;tuaique;;tuam;;tuamne;;tuamque;;tuamst;;tuamve;;tuan;;tuane;;tuaque;;tuarum;;tuarumque;;tuas;;tuasne;;tuasque;;tuast;;tuasue;;tue;;tuest;;tuis;;tuisne;;tuisque;;tuo;;tuom;;tuomque;;tuomst;;tuon;;tuoque;;tuorum;;tuorumque;;tuos;;tuosne;;tuosque;;tuost;;tuosve;;tuum;;tuumne;;tuumque;;tuusque;;tuusue;;hic;;hac;;hacne;;hae;;haec;;haecine;;haecinest;;haecne;;haeque;;haeve;;han;;hanc;;hancine;;hancne;;hancque;;hann;;harum;;harumque;;has;;hasce;;hascine;;hasne;;hasque;;hi;;hicine;;hicinest;;hicne;;hin;;hine;;hinn;;hique;;his;;hisce;;hisdem;;hisne;;hisque;;hoc;;hocin;;hocine;;hocinest;;hocne;;hocque;;hon;;horum;;horumque;;horunc;;hos;;hosce;;hosne;;hosque;;host;;huic;;huius;;huiusce;;huiusne;;huiusque;;huiusve;;hujus;;hujusce;;hujusne;;hujusque;;hujusve;;hum;;hunc;;huncne;;ille;;illa;;illae;;illaeque;;illam;;illamne;;illan;;illane;;illaque;;illarum;;illas;;illasque;;illast;;illave;;illene;;illest;;illi;;illique;;illis;;illisque;;illist;;illisue;;illiue;;illius;;illiusque;;illiust;;illo;;illoque;;illorum;;illos;;illosque;;illost;;illud;;illudne;;illudque;;illum;;illumne;;illumque;;illumst;;illumve;;olla;;ollae;;ollam;;ollarum;;ollas;;olle;;olli;;ollique;;ollis;;ollisque;;ollius;;ollo;;ollos;;ollosque;;iste;;ista;;istae;;istaec;;istam;;istamque;;istanc;;istane;;istaque;;istarum;;istas;;istast;;istest;;isti;;istimet;;istique;;istis;;istisne;;istisve;;istius;;isto;;iston;;istorum;;istos;;istuc;;istud;;istum;;istumne;;istunc;;ipse;;ipsa;;ipsae;;ipsaeque;;ipsam;;ipsamque;;ipsane;;ipsaque;;ipsarum;;ipsarumque;;ipsas;;ipsasque;;ipsast;;ipsemet;;ipsene;;ipseque;;ipsest;;ipsi;;ipsimet;;ipsine;;ipsique;;ipsis;;ipsisne;;ipsisque;;ipsist;;ipsius;;ipsiusque;;ipso;;ipson;;ipsoque;;ipsorum;;ipsorumque;;ipsos;;ipsosne;;ipsosque;;ipsost;;ipsum;;ipsumne;;ipsumque;;ipsus;;ipsusne;;ipsusque;;ipsust;;is;;ea;;eae;;eaeque;;eam;;eamdem;;eamne;;eamque;;eamue;;ean;;eane;;eanest;;eaque;;earum;;earumne;;earumque;;earumue;;earumve;;eas;;easque;;east;;easue;;eaue;;eave;;ei;;ein;;eine;;eique;;eis;;eisne;;eisque;;eiue;;eius;;eiusque;;eiust;;eiusue;;eive;;ejus;;ejusque;;ejust;;ejusue;;eo;;eoque;;eorum;;eorumdem;;eorumne;;eorumque;;eorumue;;eorumve;;eos;;eosne;;eosque;;eost;;eosue;;eoue;;eum;;eumdem;;eumne;;eumque;;eumue;;eumve;;id;;idne;;idnest;;idque;;idue;;iidem;;iidemque;;iique;;iis;;iisne;;iisque;;iisue;;isne;;isque;;idem;;eademne;;eademque;;eademst;;eademve;;eaedem;;eaedemque;;eandem;;eandemque;;earumdem;;easdem;;easdemne;;easdemque;;eidem;;eidemque;;eisdem;;eisdemque;;eiusdem;;eiusdemque;;ejusdem;;ejusdemque;;eodem;;eodemque;;eorundem;;eosdem;;eosdemne;;eosdemque;;eundem;;eundemne;;eundemque;;idemne;;idemque;;idemst;;iisdem;;iisdemque;;isdem;;isdemne;;isdemque;;suus;;sua;;suae;;suaeque;;suai;;suam;;suamne;;suamque;;suane;;suaque;;suarum;;suarumque;;suas;;suasque;;suaue;;sue;;sui;;suique;;suis;;suisne;;suisque;;suist;;suo;;suom;;suone;;suoque;;suorum;;suorumque;;suorumue;;suos;;suosque;;suum;;suumque;;suusque;;se;;secum;;secumque;;secumue;;secumve;;semet;;sen;;sese;;sest;;sibi;;sibimet;;sibine;;sibique;;suimet;;nos;;nobis;;nobiscum;;nobiscumque;;nobismet;;nobisne;;nobisque;;nosmet;;nosne;;nosque;;nost;;nostri;;nostrique;;nostrive;;nostrum;;nostrumne;;nostrumque;;noster;;nosterque;;nostra;;nostrae;;nostraeque;;nostrai;;nostram;;nostramne;;nostramque;;nostrane;;nostraque;;nostrarum;;nostrarumque;;nostras;;nostrasne;;nostrasque;;nostrast;;nostris;;nostrisque;;nostrisve;;nostro;;nostrone;;nostroque;;nostrorum;;nostrorumque;;nostrorumst;;nostros;;nostrosque;;nostrost;;vos;;uestri;;uestrique;;uobis;;uobiscum;;uobismet;;uobisne;;uobisque;;uon;;uos;;uosmet;;uosne;;uosque;;uostrum;;uostrumque;;uostrumst;;vestri;;vestrique;;vobis;;vobiscum;;vobismet;;vobisne;;vobisque;;von;;vosmet;;vosne;;vosque;;vostrum;;vostrumque;;vostrumst;;vester;;uester;;uesterque;;uestra;;uestrae;;uestraene;;uestraeque;;uestram;;uestramne;;uestramque;;uestrane;;uestraque;;uestrarum;;uestras;;uestrasque;;uestris;;uestrisne;;uestrisque;;uestrius;;uestro;;uestrone;;uestroque;;uestrorum;;uestrorumque;;uestros;;uestrosque;;uestrum;;uestrumque;;uestrumst;;uoster;;uostra;;uostrae;;uostraeque;;uostram;;uostraque;;uostrarum;;uostras;;uostrast;;uostri;;uostris;;uostrist;;uostro;;uostrorum;;uostros;;uostrosque;;uostrost;;vesterque;;vestra;;vestrae;;vestraene;;vestraeque;;vestram;;vestramne;;vestramque;;vestrane;;vestraque;;vestrarum;;vestras;;vestrasque;;vestris;;vestrisne;;vestrisque;;vestrius;;vestro;;vestrone;;vestroque;;vestrorum;;vestrorumque;;vestros;;vestrosque;;vestrum;;vestrumque;;vestrumst;;voster;;vostra;;vostrae;;vostraeque;;vostram;;vostraque;;vostrarum;;vostras;;vostrast;;vostri;;vostris;;vostrist;;vostro;;vostrorum;;vostros;;vostrosque;;vostrost;;qui;;cui;;cuilibet;;cuine;;cuipiam;;cuiue;;cuius;;cuiuslibet;;cuiuspiam;;cuiust;;cuiusue;;cuiusve;;cuive;;cujus;;cujuslibet;;cujuspiam;;cujust;;cujusue;;cujusve;;qua;;quae;;quaedem;;quaelibet;;quaen;;quaene;;quaepiam;;quaepiamst;;quaestuis;;quaestuist;;quaeue;;quaeve;;quamne;;quampiam;;quamue;;quamve;;quan;;quapiam;;quarum;;quarumlibet;;quas;;quaslibet;;quast;;quasue;;quasve;;quaue;;quave;;quei;;quein;;queique;;quem;;quemlibet;;quemne;;quempiam;;quemue;;quemve;;quibus;;quibuscum;;quibuslibet;;quibusue;;quibusve;;quicum;;quicumuis;;quicumvis;;quilibet;;quiue;;quive;;quod;;quodlibet;;quodne;;quodpiam;;quodue;;quodve;;quoi;;quoicumque;;quoin;;quoique;;quoiuis;;quoivis;;quon;;quorum;;quorumlibet;;quorumst;;quos;;quoslibet;;quosne;;quospiam;;quost;;quosue;;quosve;;quum;;quis;;quid;;quidlibet;;quidne;;quidni;;quidpiam;;quidue;;quidve;;quiscumque;;quisue;;quisve;;quo;;quone;;quoue;;quove;;quisquam;;cuiquam;;cuiquamst;;cuiusquam;;cujusquam;;quamquamst;;quaquam;;quaquamst;;quemquam;;quemquamne;;quemquamst;;quicquam;;quicquamne;;quicquamst;;quidquam;;quiquam;;quisquamne;;quisquamst;;quoquam;;quisnam;;cuinam;;cuiusnam;;cujusnam;;quaenam;;quaenamst;;quamnam;;quanam;;quarumnam;;quasnam;;quemnam;;quibusnam;;quidnam;;quidnamst;;quinam;;quodnam;;quosnam;;quisquis;;quaqua;;quemquem;;quicquid;;quidquid;;quiqui;;quiquidem;;quoquo;;quisque;;cuique;;cuiquest;;cuiusque;;cujusque;;quaeque;;quamque;;quaque;;quarumque;;quasque;;quemque;;quibusque;;quicque;;quidque;;quique;;quodque;;quorumque;;quosque;;quicumque;;cuicumque;;cuicunque;;cuiuscumque;;cuiuscunque;;cujuscumque;;cujuscunque;;quacumque;;quacunque;;quaecumque;;quaecunque;;quamcumque;;quamcunque;;quarumcumque;;quascumque;;quascunque;;quemcumque;;quemcunque;;quibuscumque;;quibuscunque;;quicumquest;;quicunque;;quocumque;;quodcumque;;quodcunque;;quorumcumque;;quoscumque;;quoscunque;;quivis;;cuiuis;;cuiusuis;;cuiusvis;;cuivis;;cujusuis;;cujusvis;;quaeuis;;quaevis;;quamuis;;quamvis;;quarumuis;;quarumvis;;quasuis;;quasvis;;quauis;;quavis;;quemuis;;quemvis;;quibusuis;;quibusvis;;quiduis;;quidvis;;quiuis;;quoduis;;quodvis;;quosuis;;quosvis;;quidam;;cuidam;;cuiusdam;;cujusdam;;quadam;;quaedam;;quaedamque;;quaedamst;;quamdam;;quandam;;quandamque;;quarumdam;;quasdam;;quasdamque;;quemdam;;quendam;;quibusdam;;quidamque;;quidamst;;quiddam;;quiddamst;;quoddam;;quorumdam;;quosdam;;quosdamque;;quosdamve;;aliqui;;alicui;;alicuius;;alicujus;;aliqua;;aliquae;;aliqualibet;;aliquam;;aliquan;;aliquane;;aliquarum;;aliquas;;aliquast;;aliquaue;;alique;;aliquem;;aliquemque;;aliquibus;;aliquis;;aliquisne;;aliquisque;;aliquit;;aliquod;;aliquodue;;aliquorum;;aliquos;;aliquid;;aliquidque;;aliquidue;;aliquo;;NOUNS;;res;;re;;rebus;;rebusque;;rei;;reique;;reist;;rem;;remque;;remst;;remve;;reque;;rerum;;rerumne;;rerumque;;resne;;resque;;rest;;resve;;nihil;;nihilne;;nihilque;;nil;;nilne;;nilque;;causa;;nemo;;nemine;;neminem;;neminemne;;nemini;;neminis;;neminisque;;nemon;;nemone;;nemoque;;nemost;;ADJECTIVES;;omnis;;omne;;omnem;;omnemque;;omnene;;omneque;;omnes;;omnesne;;omnesque;;omnest;;omni;;omnia;;omnian;;omniane;;omniaque;;omnibus;;omnibusne;;omnibusque;;omnibust;;omnibusue;;omnin;;omnique;;omnisne;;omnisque;;omnist;;omnium;;omniumque;;omniumst;;nullus;;nulla;;nullae;;nullaene;;nullaeque;;nullam;;nullamne;;nullamque;;nullan;;nullane;;nullaque;;nullarum;;nullas;;nullasne;;nullasque;;nullast;;nullave;;nulli;;nulline;;nullique;;nullis;;nullisne;;nullisque;;nullius;;nulliusque;;nullo;;nullon;;nullone;;nulloque;;nullorum;;nullorumque;;nullos;;nullosne;;nullosque;;nullum;;nullumne;;nullumque;;nullumst;;nullusne;;nullusnest;;nullusque;;nullust;;ullus;;ulla;;ullae;;ullam;;ullamve;;ullane;;ullarum;;ullas;;ullast;;ullave;;ulli;;ulline;;ullis;;ullius;;ullo;;ullorum;;ullos;;ullum;;ullumve;;ullusne;;ullust;;multus;;multa;;multae;;multaeque;;multaeve;;multam;;multamque;;multane;;multaque;;multarum;;multarumque;;multas;;multasque;;multi;;multique;;multis;;multisne;;multisque;;multisve;;multo;;multoque;;multorum;;multorumque;;multos;;multosque;;multost;;multosve;;multum;;multumque;;multumst;;multusque;;plus/plures;;plura;;pluraque;;pluraue;;plurave;;plure;;plures;;pluresne;;pluresque;;pluresue;;pluresve;;pluribus;;pluribusne;;pluribusque;;pluribusue;;pluribusve;;plurima;;plurimae;;plurimaeque;;plurimam;;plurimaque;;plurimarum;;plurimas;;plurimasque;;plurime;;plurimi;;plurimique;;plurimis;;plurimisque;;plurimo;;plurimoque;;plurimorum;;plurimos;;plurimosque;;plurimum;;plurimumque;;plurimumst;;plurimus;;plurimusque;;pluris;;plurisne;;plurisque;;plurisue;;plurium;;pluriumue;;pluriumve;;alius;;alia;;aliae;;aliaeque;;aliaest;;aliaeue;;aliaeve;;aliam;;aliamne;;aliamque;;aliamue;;aliamve;;alian;;aliaque;;aliarum;;aliarumque;;aliarumue;;alias;;aliasque;;aliast;;aliaue;;aliave;;alii;;aliique;;aliis;;aliisne;;aliisque;;aliisue;;aliisve;;aliiue;;alio;;alione;;alioque;;aliorum;;aliorumque;;aliorumue;;aliorumve;;alios;;aliosque;;aliost;;aliosve;;alioue;;aliove;;aliud;;aliudque;;aliudue;;aliudve;;alium;;aliumque;;aliumue;;aliumve;;aliusne;;aliusque;;aliusue;;aliusve;;alter;;altera;;alterae;;alteram;;alteramque;;alteramue;;alteraque;;alterarum;;alteras;;alterast;;alterave;;alteri;;alteris;;alterius;;alteriusque;;alteriusue;;alterive;;altero;;alteroque;;alterorum;;alteros;;alteroue;;alterove;;alterque;;alterue;;alterum;;alterumque;;alterumue;;alterumve;;alterve;;ceter;;ceterus;;caetera;;caeterae;;caeteram;;caeteras;;caeteri;;caeteris;;caeterisque;;caeteros;;caeterus;;cetera;;ceterae;;ceteraeque;;ceteraeve;;ceteram;;ceteramque;;ceteraque;;ceterarum;;ceterarumque;;ceteras;;ceterasque;;ceteri;;ceterique;;ceteris;;ceterisque;;ceterisue;;ceterive;;cetero;;ceteroque;;ceterorum;;ceterorumque;;ceterorumue;;ceteros;;ceterosque;;ceterus;;qualis;;quale;;qualecumque;;qualecunque;;qualem;;qualemcunque;;qualemque;;qualemve;;quales;;qualescumque;;qualescunque;;qualeslibet;;qualesque;;qualest;;qualesve;;quali;;qualia;;qualiacunque;;qualiaque;;qualibus;;qualicumque;;qualicunque;;qualine;;qualique;;qualiscunque;;qualislibet;;qualisque;;qualisve;;qualiter;;qualitercumque;;qualitercunque;;qualiterque;;qualium;;qualiumcumque;;talis;;tale;;talem;;talemque;;taleque;;tales;;talesne;;talesque;;talest;;tali;;talia;;taliane;;taliaque;;talibus;;talibusque;;talin;;taline;;talique;;talisque;;talisve;;taliter;;talium;;taliumque;;quantus;;quanta;;quantacumque;;quantacunque;;quantae;;quantaecumque;;quantaelibet;;quantaeque;;quantaeuis;;quantalibet;;quantam;;quantamcumque;;quantamque;;quantane;;quantaque;;quantarum;;quantas;;quantaslibet;;quantasque;;quantasuis;;quantasve;;quantasvis;;quantauis;;quantave;;quantavis;;quanti;;quanticumque;;quantilibet;;quantine;;quantique;;quantis;;quantiscumque;;quantislibet;;quantisque;;quantist;;quantiuis;;quantivis;;quanto;;quantocumque;;quantolibet;;quantoque;;quantorum;;quantos;;quantosne;;quantosque;;quantoue;;quantouis;;quantove;;quantovis;;quantum;;quantumcumque;;quantumlibet;;quantumque;;quantumst;;quantumue;;quantumuis;;quantumvis;;quantuscumque;;quantusne;;quantusque;;tantus;;tanta;;tantadem;;tantae;;tantaene;;tantaeque;;tantam;;tantamne;;tantamque;;tantan;;tantandem;;tantane;;tantaque;;tantarum;;tantarumque;;tantas;;tantasque;;tantast;;tante;;tanti;;tantidem;;tantidemst;;tantine;;tantique;;tantis;;tantisque;;tantist;;tanto;;tanton;;tantone;;tantoque;;tantorum;;tantorumque;;tantos;;tantosque;;tantove;;tantumdem;;tantumdemst;;tantumne;;tantumque;;tantumst;;tantundem;;tantundemque;;tantundemst;;tantusque;;VERBS;;sum;;eram;;eramque;;eramus;;erant;;erantque;;eras;;erat;;eratis;;eratne;;eratque;;erimus;;erimusque;;erin;;eris;;erisque;;erit;;eritis;;eritisque;;eritne;;eritque;;eritue;;ero;;eroque;;erunt;;eruntque;;eruntue;;eruntve;;es;;esne;;esque;;esse;;essem;;essemque;;essemus;;essemusne;;essemusque;;essemusve;;essene;;essent;;essentne;;essentque;;essentve;;esseque;;esses;;essesne;;essesque;;essesve;;esset;;essetis;;essetisne;;essetisque;;essetisve;;essetne;;essetque;;essetve;;esseve;;est;;este;;estene;;esteque;;esteve;;estis;;estisne;;estisque;;estisve;;estne;;esto;;eston;;estote;;estque;;estve;;esve;;fore;;forem;;forent;;fores;;foresque;;foret;;fuam;;fuant;;fuas;;fuat;;fueram;;fueramque;;fueramus;;fuerant;;fueras;;fuerat;;fueratis;;fueratque;;fuere;;fuerim;;fuerimque;;fuerimus;;fuerint;;fuerintne;;fuerintque;;fueris;;fuerisne;;fuerit;;fueritis;;fueritne;;fueritque;;fueritue;;fueritve;;fuero;;fuerunt;;fueruntne;;fueruntque;;fui;;fuimus;;fuimusque;;fuimusve;;fuisse;;fuissem;;fuissemus;;fuissent;;fuisseque;;fuisses;;fuisset;;fuissetis;;fuissetque;;fuisti;;fuistin;;fuistique;;fuistis;;fuistisne;;fuit;;fuitne;;fuitque;;futura;;futurae;;futuraeque;;futuram;;futuramque;;futuraque;;futurarum;;futuras;;futurast;;futurave;;future;;futuri;;futurique;;futuris;;futurisque;;futuro;;futurorum;;futurorumque;;futuros;;futurosque;;futurove;;futurum;;futurumque;;futurumst;;futurumve;;futurus;;futurusne;;futurusque;;futurusve;;siem;;sient;;sies;;siet;;simne;;simque;;simus;;sint;;sintne;;sintque;;sis;;sisne;;sisque;;sist;;sit;;sitis;;sitisque;;sitne;;sitque;;sitve;;sumne;;sumque;;sumus;;sumusque;;sumusve;;sunt;;suntne;;sunto;;suntoque;;suntque;;possum;;posse;;possem;;possemne;;possemque;;possemus;;possent;;possentne;;posseque;;posses;;possesne;;posset;;possetis;;possetisne;;possetne;;possetque;;possim;;possimne;;possimus;;possimusne;;possin;;possint;;possintne;;possintque;;possis;;possisne;;possisque;;possit;;possitis;;possitne;;possitque;;possumne;;possumus;;possumusne;;possunt;;possuntne;;possuntque;;potens;;potensque;;potentem;;potentemque;;potentes;;potentesque;;potenti;;potentia;;potentibus;;potentis;;potentisque;;potentium;;poteram;;poteramus;;poteramusne;;poterant;;poterantque;;poteras;;poterat;;poteratis;;poteratne;;poteratque;;poterimus;;poterin;;poteris;;poterisne;;poterisque;;poterit;;poteritis;;poteritisne;;poteritne;;poteritque;;potero;;poteron;;poterone;;poterunt;;poteruntque;;potes;;potesne;;potesque;;potest;;potestis;;potestisne;;potestne;;potestque;;potueram;;potueramus;;potuerant;;potueras;;potuerat;;potueratis;;potuere;;potuerim;;potuerimus;;potuerint;;potueris;;potuerit;;potueritis;;potueritne;;potueritque;;potuero;;potuerunt;;potueruntne;;potueruntque;;potui;;potuimus;;potuine;;potuique;;potuisse;;potuissem;;potuissemus;;potuissent;;potuisses;;potuisset;;potuissetis;;potuisti;;potuistine;;potuistis;;potuit;;potuitne;;potuitque;;potuitue;;do;;da;;dabam;;dabamus;;dabant;;dabantque;;dabantur;;dabanturque;;dabar;;dabas;;dabat;;dabatque;;dabatur;;dabaturque;;daberis;;dabimus;;dabimusque;;dabin;;dabis;;dabisne;;dabisque;;dabit;;dabitis;;dabitque;;dabitur;;dabiturne;;dabiturque;;dabo;;daboque;;dabor;;dabunt;;dabuntque;;dabuntur;;damur;;damus;;damusque;;dan;;danda;;dandae;;dandam;;dandamque;;dandaque;;dandarum;;dandas;;dandi;;dandique;;dandis;;dando;;dandoque;;dandorum;;dandos;;dandosne;;dandosque;;dandum;;dandumque;;dandumst;;dandus;;dandusque;;dans;;dant;;dante;;dantem;;dantes;;danti;;dantia;;dantibus;;dantis;;danto;;dantque;;dantur;;daque;;dare;;darem;;daremus;;daren;;darent;;darentque;;darentur;;dareque;;darer;;dareris;;dares;;daret;;daretis;;daretque;;daretur;;dari;;darier;;darique;;daris;;dariue;;das;;dasne;;dasque;;dat;;data;;datae;;datam;;datamque;;dataque;;datarum;;datas;;datasque;;datast;;date;;dati;;datin;;datiores;;datique;;datis;;datisne;;datisque;;datne;;dato;;datoque;;datorum;;datos;;datosque;;datque;;datu;;datum;;datumque;;datumst;;datur;;datura;;daturae;;daturam;;daturas;;dature;;daturi;;daturin;;daturique;;daturis;;daturo;;daturos;;daturque;;daturum;;daturumque;;daturus;;daturust;;datus;;datusque;;datust;;daue;;dave;;dederam;;dederamque;;dederamus;;dederant;;dederas;;dederat;;dederatque;;dedere;;dederim;;dederimus;;dederint;;dederis;;dederisque;;dederit;;dederitis;;dederitque;;dedero;;dederunt;;dederuntque;;dedi;;dedimus;;dedin;;dedique;;dedisse;;dedissem;;dedissemus;;dedissent;;dedisses;;dedisset;;dedissetis;;dedissetue;;dedisti;;dedistin;;dedistique;;dedistis;;dedit;;deditque;;dem;;demque;;demus;;demusque;;den;;dent;;dentque;;dentur;;der;;dere;;deris;;des;;desque;;det;;detis;;detisque;;detque;;detur;;deturque;;don;;doque;;dor;;duim;;duint;;duis;;duisque;;duit;;video;;uide;;uideam;;uideamini;;uideamque;;uideamur;;uideamus;;uideamusque;;uideant;;uideantur;;uidear;;uideare;;uidearis;;uideas;;uideasque;;uideat;;uideatis;;uideatque;;uideatur;;uideaturne;;uideaturque;;uidebam;;uidebamini;;uidebamque;;uidebamur;;uidebamus;;uidebant;;uidebantque;;uidebantur;;uidebanturque;;uidebar;;uidebare;;uidebaris;;uidebarque;;uidebas;;uidebat;;uidebatis;;uidebatque;;uidebatur;;uidebaturque;;uidebere;;uideberis;;uidebimur;;uidebimus;;uidebis;;uidebit;;uidebitis;;uidebitur;;uidebo;;uidebor;;uidebunt;;uidebuntque;;uidebuntur;;uidemini;;uidemur;;uidemurne;;uidemus;;uidemusne;;uidemusque;;uiden;;uidenda;;uidendae;;uidendam;;uidendaque;;uidendi;;uidendique;;uidendis;;uidendo;;uidendos;;uidendum;;uidendumque;;uidendumst;;uidendus;;uidens;;uidensque;;uident;;uidente;;uidentem;;uidentes;;uidenti;;uidentibus;;uidentique;;uidentis;;uidentium;;uidento;;uidentque;;uidentur;;uidenturne;;uidenturque;;uideo;;uideon;;uideone;;uideoque;;uideor;;uideorne;;uideorque;;uideram;;uideramus;;uiderant;;uideras;;uiderat;;uideratis;;uidere;;uiderem;;uideremini;;uideremur;;uideremus;;uiderent;;uiderentque;;uiderentur;;uiderenturne;;uidereque;;uiderer;;uiderere;;uidereris;;uideres;;uideret;;uideretis;;uideretque;;uideretur;;uidereturne;;uidereturque;;uideri;;uiderier;;uiderim;;uiderimus;;uiderint;;uiderintne;;uiderintue;;uiderique;;uideris;;uiderisque;;uiderit;;uideritis;;uideritne;;uideritque;;uidero;;uiderunt;;uideruntque;;uides;;uidesne;;uidesque;;uidet;;uidete;;uidetin;;uidetis;;uidetisne;;uideto;;uidetote;;uidetque;;uidetur;;uideturne;;uideturque;;uidi;;uidimus;;uidimusque;;uidin;;uidique;;uidisse;;uidissem;;uidissemque;;uidissemus;;uidissent;;uidissentque;;uidisses;;uidisset;;uidissetis;;uidissetque;;uidissetve;;uidisti;;uidistin;;uidistine;;uidistis;;uidit;;uiditque;;uisa;;uisae;;uisaeque;;uisam;;uisamque;;uisanest;;uisaque;;uisas;;uisast;;uise;;uisen;;uisi;;uisique;;uisis;;uisisque;;uiso;;uison;;uisoque;;uisorum;;uisos;;uisosque;;uisu;;uisum;;uisumque;;uisumst;;uisun;;uisuque;;uisura;;uisurae;;uisuram;;uisuraque;;uisuras;;uisure;;uisuri;;uisuris;;uisuros;;uisurum;;uisurus;;uisurusne;;uisus;;uisusque;;uisust;;uisuve;;vide;;videam;;videamini;;videamque;;videamur;;videamus;;videamusque;;videant;;videantur;;videar;;videare;;videaris;;videas;;videasque;;videat;;videatis;;videatque;;videatur;;videaturne;;videaturque;;videbam;;videbamini;;videbamque;;videbamur;;videbamus;;videbant;;videbantque;;videbantur;;videbanturque;;videbar;;videbare;;videbaris;;videbarque;;videbas;;videbat;;videbatis;;videbatque;;videbatur;;videbaturque;;videbere;;videberis;;videbimur;;videbimus;;videbis;;videbit;;videbitis;;videbitur;;videbo;;videbor;;videbunt;;videbuntque;;videbuntur;;videmini;;videmur;;videmurne;;videmus;;videmusne;;videmusque;;viden;;videnda;;videndae;;videndam;;videndaque;;videndi;;videndique;;videndis;;videndo;;videndos;;videndum;;videndumque;;videndumst;;videndus;;videns;;vidensque;;vident;;vidente;;videntem;;videntes;;videnti;;videntibus;;videntique;;videntis;;videntium;;vidento;;videntque;;videntur;;videnturne;;videnturque;;videon;;videone;;videoque;;videor;;videorne;;videorque;;videram;;videramus;;viderant;;videras;;viderat;;videratis;;videre;;viderem;;videremini;;videremur;;videremus;;viderent;;viderentque;;viderentur;;viderenturne;;videreque;;viderer;;viderere;;videreris;;videres;;videret;;videretis;;videretque;;videretur;;videreturne;;videreturque;;videri;;viderier;;viderim;;viderimus;;viderint;;viderintne;;viderintue;;viderique;;videris;;viderisque;;viderit;;videritis;;videritne;;videritque;;videro;;viderunt;;videruntque;;vides;;videsne;;videsque;;videt;;videte;;videtin;;videtis;;videtisne;;videto;;videtote;;videtque;;videtur;;videturne;;videturque;;vidi;;vidimus;;vidimusque;;vidin;;vidique;;vidisse;;vidissem;;vidissemque;;vidissemus;;vidissent;;vidissentque;;vidisses;;vidisset;;vidissetis;;vidissetque;;vidissetve;;vidisti;;vidistin;;vidistine;;vidistis;;vidit;;viditque;;visa;;visae;;visaeque;;visam;;visamque;;visanest;;visaque;;visas;;visast;;vise;;visen;;visi;;visique;;visis;;visisque;;viso;;vison;;visoque;;visorum;;visos;;visosque;;visu;;visum;;visumque;;visumst;;visun;;visuque;;visura;;visurae;;visuram;;visuraque;;visuras;;visure;;visuri;;visuris;;visuros;;visurum;;visurus;;visurusne;;visus;;visusque;;visust;;visuve;;facio;;fac;;face;;facere;;facerem;;faceremque;;faceremus;;faceren;;facerent;;facerentque;;faceres;;facerest;;faceret;;faceretis;;faceretne;;faceretque;;facereve;;faci;;faciam;;faciamque;;faciamus;;faciant;;faciantque;;faciantur;;facias;;faciasne;;faciasque;;faciat;;faciatis;;faciatque;;faciatur;;faciebam;;faciebamus;;faciebant;;faciebantque;;faciebas;;faciebat;;faciebatis;;faciebatque;;faciemus;;faciemusque;;facienda;;faciendae;;faciendai;;faciendam;;faciendarum;;faciendas;;faciendi;;faciendique;;faciendis;;faciendiue;;faciendive;;faciendo;;faciendoque;;faciendorum;;faciendos;;faciendosque;;faciendum;;faciendumne;;faciendumque;;faciendumst;;faciendumve;;faciendus;;faciens;;facient;;faciente;;facientem;;facientes;;facienti;;facientia;;facientibus;;facientibusque;;facientis;;facientium;;facientque;;facientur;;facies;;faciesque;;faciesve;;faciet;;facietis;;facietisque;;facietque;;facimus;;facioque;;facis;;facisne;;facisque;;facit;;facite;;facitis;;facitne;;facito;;facitoque;;facitote;;facitque;;facitur;;faciunda;;faciundae;;faciundam;;faciundas;;faciundi;;faciundis;;faciundisque;;faciundo;;faciundorum;;faciundos;;faciundum;;faciundumst;;faciundus;;faciunt;;faciuntne;;faciunto;;faciuntque;;facque;;facta;;factae;;factaeque;;factam;;factamque;;factaque;;factarum;;factas;;factast;;factaue;;facte;;facti;;factique;;factis;;factisque;;factius;;facto;;factoque;;factorum;;factorumque;;factos;;factost;;factoue;;factu;;factum;;factumne;;factumque;;factumst;;factumue;;factumve;;factuque;;factura;;facturae;;facturam;;facturas;;facturave;;facturi;;facturis;;facturo;;facturos;;facturosque;;facturum;;facturumque;;facturumue;;facturus;;facturusne;;facturusque;;facturust;;facturusue;;factus;;factusne;;factusque;;factust;;faxim;;faxint;;faxis;;faxit;;faxo;;feceram;;feceramus;;fecerant;;fecerantque;;feceras;;fecerat;;feceratis;;feceratque;;fecere;;fecerim;;fecerimque;;fecerimus;;fecerint;;feceris;;fecerisne;;fecerit;;feceritis;;feceritque;;feceritue;;fecero;;fecerunt;;feceruntque;;feci;;fecimus;;fecique;;fecisse;;fecissem;;fecissemus;;fecissent;;fecissentque;;fecisseque;;fecisses;;fecisset;;fecissetis;;fecissetue;;fecisti;;fecistique;;fecistis;;fecit;;fecitne;;fecitque;;dico;;dic;;dicam;;dicamini;;dicamne;;dicamque;;dicamur;;dicamus;;dicamve;;dicant;;dicantur;;dicar;;dicare;;dicaris;;dicarque;;dicas;;dicasque;;dicasve;;dicat;;dicatis;;dicatque;;dicatur;;dicaturque;;dice;;dicebam;;dicebamini;;dicebamque;;dicebamus;;dicebant;;dicebantque;;dicebantur;;dicebanturque;;dicebar;;dicebare;;dicebas;;dicebat;;dicebatis;;dicebatque;;dicebatur;;dicemur;;dicemus;;dicemusque;;dicen;;dicenda;;dicendae;;dicendaeque;;dicendaeve;;dicendam;;dicendamue;;dicendane;;dicendarum;;dicendas;;dicendast;;dicende;;dicendi;;dicendique;;dicendis;;dicendo;;dicendoque;;dicendos;;dicendove;;dicendum;;dicendumque;;dicendumst;;dicendus;;dicens;;dicensque;;dicensve;;dicent;;dicente;;dicentem;;dicentemque;;dicentes;;dicenti;;dicentia;;dicentibus;;dicentis;;dicentium;;dicentque;;dicentur;;dicere;;dicerem;;diceremus;;dicerent;;dicerentque;;dicerentur;;dicereque;;dicerer;;dicereris;;diceres;;diceresne;;diceret;;diceretis;;diceretque;;diceretur;;dicereturue;;diceris;;dices;;dicesne;;dicesque;;dicet;;dicetis;;dicetne;;dicetque;;dicetur;;diceturque;;dici;;dicier;;dicimini;;dicimur;;dicimus;;dicin;;dicique;;dicis;;dicisne;;dicisque;;dicit;;dicite;;dicitis;;dicito;;dicitque;;dicitur;;diciturne;;dicta;;dictae;;dictaeque;;dictam;;dictamque;;dictaque;;dictarum;;dictas;;dictasque;;dictast;;dicte;;dicti;;dictique;;dictis;;dictisque;;dictiue;;dicto;;dictoque;;dictorum;;dictorumque;;dictos;;dictoue;;dictove;;dictu;;dictum;;dictumque;;dictumst;;dictumue;;dictumve;;dictuque;;dictura;;dicturam;;dicturas;;dicturi;;dicturis;;dicturo;;dicturos;;dicturosque;;dicturum;;dicturumque;;dicturus;;dicturusne;;dicturusque;;dicturusve;;dictus;;dictusque;;dictust;;dicunda;;dicundae;;dicundi;;dicundis;;dicundo;;dicundum;;dicundumst;;dicunt;;dicunto;;dicuntque;;dicuntur;;dixe;;dixeram;;dixeramus;;dixerant;;dixeras;;dixerat;;dixeratis;;dixere;;dixerim;;dixerimus;;dixerin;;dixerint;;dixeris;;dixerisne;;dixerit;;dixeritis;;dixeritne;;dixeritque;;dixero;;dixerunt;;dixeruntque;;dixi;;diximus;;dixin;;dixique;;dixisse;;dixissem;;dixissemus;;dixissent;;dixisses;;dixisset;;dixissetque;;dixisti;;dixistique;;dixistis;;dixit;;dixitne;;dixitque;;habeo;;habe;;habeam;;habeamini;;habeamus;;habeant;;habeantne;;habeantque;;habeantur;;habear;;habeare;;habearis;;habeas;;habeasne;;habeasque;;habeat;;habeatis;;habeatque;;habeatur;;habeaturque;;habebam;;habebamus;;habebant;;habebantque;;habebantur;;habebas;;habebat;;habebatis;;habebatque;;habebatur;;habebaturque;;habebere;;habeberis;;habebimur;;habebimus;;habebis;;habebit;;habebitis;;habebitque;;habebitur;;habebo;;habebor;;habebunt;;habebuntque;;habebuntur;;habemur;;habemus;;haben;;habenda;;habendae;;habendaeque;;habendam;;habendamque;;habendarum;;habendas;;habendast;;habendi;;habendique;;habendis;;habendo;;habendoque;;habendorum;;habendos;;habendum;;habendumque;;habendumst;;habendus;;habendusve;;habens;;habensque;;habent;;habente;;habentem;;habentes;;habenti;;habentia;;habentibus;;habentis;;habentium;;habentne;;habento;;habentque;;habentur;;habeon;;habeoque;;habeor;;habere;;haberem;;haberemque;;haberemus;;haberent;;haberentque;;haberentue;;haberentur;;habereque;;haberes;;haberet;;haberetis;;haberetne;;haberetque;;haberetur;;habereturque;;haberi;;haberier;;haberique;;haberis;;habes;;habesne;;habet;;habete;;habetin;;habetis;;habetisque;;habeto;;habetote;;habetque;;habetur;;habeturque;;habita;;habitae;;habitam;;habitaque;;habitas;;habitasque;;habitast;;habite;;habiti;;habitior;;habitis;;habitissimum;;habito;;habitoque;;habitorum;;habitos;;habitosque;;habitu;;habitum;;habitumque;;habitune;;habituque;;habitura;;habiturae;;habituram;;habituras;;habituri;;habiturine;;habituris;;habituro;;habituros;;habiturum;;habiturumue;;habiturus;;habiturusque;;habiturust;;habiturusue;;habitus;;habitusque;;habitust;;habueram;;habueramus;;habuerant;;habueras;;habuerat;;habuere;;habuerim;;habuerimus;;habuerint;;habueris;;habuerisque;;habuerit;;habueritis;;habueritne;;habueritque;;habuero;;habuerunt;;habueruntque;;habui;;habuimus;;habuique;;habuisse;;habuissem;;habuissemus;;habuissent;;habuisseque;;habuisses;;habuisset;;habuissetis;;habuissetque;;habuisti;;habuistis;;habuit;;habuitne;;habuitque;;fero;;fer;;feram;;feramque;;feramur;;feramus;;ferant;;ferantur;;feranturque;;ferar;;ferare;;feraris;;feras;;ferasque;;ferasue;;ferat;;feratis;;feratque;;feratur;;feraturque;;ferebam;;ferebamur;;ferebamus;;ferebant;;ferebantque;;ferebantur;;ferebanturque;;ferebar;;ferebare;;ferebaris;;ferebas;;ferebat;;ferebatis;;ferebatque;;ferebatur;;ferebaturque;;feremur;;feremus;;feren;;ferenda;;ferendae;;ferendam;;ferendaque;;ferendarum;;ferendas;;ferendi;;ferendine;;ferendis;;ferendo;;ferendos;;ferendum;;ferendus;;ferens;;ferent;;ferente;;ferentem;;ferentes;;ferenti;;ferentia;;ferentibus;;ferentis;;ferentium;;ferentur;;ferere;;fereris;;feres;;feresne;;feret;;feretis;;feretque;;feretur;;feroque;;feror;;ferorque;;ferque;;ferre;;ferrem;;ferremus;;ferrent;;ferrentur;;ferreque;;ferres;;ferret;;ferretis;;ferretne;;ferretque;;ferretur;;ferri;;ferrique;;ferrist;;ferriue;;ferrive;;fers;;fersne;;fersque;;fert;;ferte;;fertis;;fertne;;ferto;;fertor;;fertque;;fertur;;ferturque;;ferue;;ferundae;;ferundam;;ferundast;;ferundi;;ferundis;;ferundo;;ferundum;;ferunt;;ferunto;;feruntque;;feruntur;;lata;;latae;;latam;;latamque;;lataque;;latarum;;latarumque;;latas;;late;;lateque;;latest;;lati;;latin;;latine;;latineque;;latior;;latiora;;latiore;;latiorem;;latioremque;;latiores;;latioribus;;latioribusque;;latioris;;latiorque;;latiorum;;latique;;latis;;latisque;;latissima;;latissimae;;latissimam;;latissimarum;;latissimas;;latissime;;latissimeque;;latissimi;;latissimis;;latissimo;;latissimos;;latissimum;;latissimus;;latius;;latiusque;;lato;;laton;;latone;;latoque;;latorum;;latorumque;;latos;;latosque;;latu;;latum;;latumque;;latumst;;latura;;laturam;;laturas;;laturi;;laturique;;laturis;;laturo;;laturos;;laturum;;laturumque;;laturus;;latus;;latusque;;tetulere;;tetulerit;;tetulero;;tetulerunt;;tetuli;;tetulisse;;tetulissem;;tetulissent;;tetulisset;;tetulisti;;tetulit;;tuleram;;tuleramus;;tulerant;;tuleras;;tulerat;;tulere;;tulerim;;tulerimus;;tulerint;;tulerintque;;tuleris;;tulerit;;tuleritis;;tulero;;tulerunt;;tuleruntque;;tuli;;tulimus;;tulimusque;;tulique;;tulisse;;tulissem;;tulissemus;;tulissent;;tulisses;;tulisset;;tulissetis;;tulisti;;tulistis;;tulit;;tulitque;;fio;;fi;;fiam;;fiamque;;fiamus;;fiant;;fiantque;;fias;;fiat;;fiatque;;ficumque;;fiebam;;fiebant;;fiebat;;fient;;fientque;;fierem;;fierent;;fieres;;fieret;;fieretque;;fieretue;;fieri;;fierine;;fierique;;fieriue;;fies;;fiet;;fietque;;fimus;;fis;;fit;;fite;;fitque;;fiunt;;fiuntque;;inquam;;inquamst;;inque;;inquiebat;;inquies;;inquiet;;inquii;;inquimus;;inquin;;inquis;;inquisti;;inquit;;inquito;;inquiunt;;aio;;aiant;;aias;;aiat;;aibant;;aibas;;aibat;;aiebam;;aiebamus;;aiebant;;aiebas;;aiebat;;aiebatis;;ain;;ais;;aisne;;ait;;aitque;;aiunt;;aiuntque";


const defaultconf = ";;;true;;;true;;;false;;;false;;;true;;;true;;;true;;;false;;;false;;;false;;;true;;;false;;;false;;;false;;;true;;;true;;;true;;;true;;;;;;;;;false;;;false;;;false;;;false;;;false;;;1;;;1;;;;;;;;;;;;0;;;1000;;;;;;;;;cosineM;;;1;;;0;;;false;;;false;;;false;;;false;;;false;;;false;;;true;;;true;;;;;;;;;;;;;;;;;;;;;;;;;;;4;;;;;;;;;3;;;;;;2024-04-25;;;;;;default;;;;;;false;;;false;;;false;;;1;;;430;;;1;;;0;;;1000;;;1000;;;false;;;false;;;false;;;false;;;;;;;;;".split(";;;");
normalizearraykeys(); //for other stop word lists

const nameofapp = "styloAHonline";
const dbversion = 1;
let myindexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB || window.mozIndexedDB;
let IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
//let openDBCopy = myindexedDB && myindexedDB.open;
let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
if( IDBTransaction ){
    IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
    IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
}

//stopwords
let stopwords = buildstopwordlistfromstring( defaultstops ); // try the one we have

//build databse - or try
createDB( nameofapp );

//check if you can get stopwords from the database
let dbre = myindexedDB.open( nameofapp, dbversion );
dbre.onsuccess = function( e ){
    let ddbb = e.target.result;
    console.log(ddbb.objectStoreNames.length, ddbb.objectStoreNames.contains('STOPWORDS'));
    if(ddbb.objectStoreNames.contains('STOPWORDS')){
        console.log("Got stopwords from database.");
        readFROM( nameofapp, "STOPWORDS", "ownstopwords", stopwords );
    } 
    dbre = null;
}


/*HELPER*/
function filenotallowed( stringof ){
    if(stringof.indexOf(".csv") != -1 ){
        return false;
    } else if(stringof.indexOf(".txt") != -1 ){
        return false;
    } else if(stringof.indexOf(".xml") != -1 ){
        return false;
    } else if(stringof.indexOf(".html") != -1 ){
        return false;
    } else if(stringof.indexOf(".config") != -1 ){
        return false;
    } else {
        return true;
    }
}

function getrandomtimeshundret( lennum ){
    let gg = lennum + Math.round( Math.random( )  * 1000 );
    if(gg > 1000){
        gg = Math.round( Math.random( )  * 1000 );
    }
    //console.log(lennum, gg);
    return gg;
}

let downelmarray = [];
//let downblobarray = []; //??
function clickitall(){
    for( let i = 0; i < downelmarray.length; i += 1 ){
        //console.log(i);
        setTimeout( function(){ downelmarray[i].click(); console.log(i, i*durationbetweendownloads, downelmarray.length); if(i == downelmarray.length-1){if(parseInt(localStorage.getItem("multiconfimax")) > parseInt(localStorage.getItem("multiconfindex"))){setTimeout( function(){ localStorage.setItem("multiconfindex", parseInt(localStorage.getItem("multiconfindex"))+1 );runmulticonfig();}, (i*durationbetweendownloads)+durationbetweendownloads); } } }, i*durationbetweendownloads );
    }
}

let themanydownloadfiles = 0;
function howmanydownloadfiles(){
    let tomult = 0;
        if( lastchangeokk == 1 ){
            tomult = 4;
            if( !document.getElementById( "expraw").checked ){
                tomult -= 1;
            } 
            if( !document.getElementById( "expnormed").checked ){
                tomult -= 1;
            } 
            if( !document.getElementById( "expdecomp").checked ){
                tomult -= 1;
            } 
            if( !document.getElementById( "expcounted").checked ){
                tomult -= 1;
            }
        } else if( lastchangeokk == 2 ){
            tomult = 2
            if( !document.getElementById( "expdecomp").checked ){
                tomult -= 1;
            } 
            if( !document.getElementById( "expcounted").checked ){
                tomult -= 1;
            }
        } else if( lastchangeokk == 3 ){
            tomult = 1;
            if( !document.getElementById( "expcounted").checked ){
                tomult -= 1;
            }
        } 
        let toaddit = 5; 
        if( !document.getElementById( "exportconf").checked ){
                toaddit -= 1;
        }
        if( !document.getElementById( "exportstopwordfile").checked ){
                toaddit -= 1;
        }
        if( !document.getElementById( "expdistmatrix").checked ){
                toaddit -= 1;
        }
        if( !document.getElementById( "expclustertext").checked ){
                toaddit -= 2;
        }
        /*if( !document.getElementById( "expclustervis").checked ){
                toaddit -= 1;
        }//does not use the downfkt has a special down svg fkt */
        //console.log("OOOO", tomult, len(fnames), toaddit);
        themanydownloadfiles = (tomult*len(fnames)) + toaddit;
}
function dodownit( contentof, nameoffile, type ){
    console.log("downit", nameoffile)
    const af = new Blob( [ contentof ], {type: type} );
    //console.log("blob ready", nameoffile)
    //downblobarray.push( af );
    const theIE = false || !!document.documentMode;
    if( theIE ){
        window.navigator.msSaveOrOpenBlob( af, nameoffile );
    } else {
        let alink = document.createElement( 'a' );
        alink.href = URL.createObjectURL( af );
        alink.download = nameoffile;
        document.body.appendChild( alink );
        downelmarray.push(alink);
        //console.log( themanydownloadfiles, downelmarray.length,  downelmarray.length == themanydownloadfiles, downelmarray, nameoffile);
        if(downelmarray.length == themanydownloadfiles){
            clickitall();
            //console.log("downed");
        }
    }
}
function parseBool( str ){
    let boolrex = /^\s*(true|1|on)\s*$/i
    return boolrex.test( str );
}

function findindexoftoken( A, string ){
    for(let o in A ){
        if( A[o][0] == string ){
            return o;
        }
    }
    return -1;
}
function showloadsign(){
    document.getElementById( "loadshow" ).style.display = "block";
}
function hideloadsign(){
    document.getElementById( "loadshow" ).style.display = "none";
}
function showERRORinload( err ){
    document.getElementById( "loadshow" ).style.display = "none";
    document.getElementById( "errorshow" ).innerHTML = err;
}

/*AUTO SAVE, CONFIG SAVE, AND INDEXDB Interface*/
function delconfigofall(){
    localStorage.clear();
    window.location.reload();
}

function sisa( ){
    //console.log("Autosave selection.")
    //naming
    
    localStorage.setItem( "nametypeown", document.getElementById( "nametypeown" ).value );
    localStorage.setItem( "nametype", document.getElementById( "nametype" ).value );
    if( document.getElementById( "nametype" ).value == "" ){document.getElementById( "nametype" ).value = "0";}
    localStorage.setItem( "namesubject", document.getElementById( "namesubject" ).value );
    localStorage.setItem( "namestateown", document.getElementById( "namestateown" ).value);
    localStorage.setItem( "namestate", document.getElementById( "namestate" ).value);
    if( document.getElementById( "namestate" ).value == "" ){document.getElementById( "namestate" ).value = "0";}
    localStorage.setItem( "nameid", document.getElementById( "nameid" ).value);
    localStorage.setItem( "namedatelook", document.getElementById( "namedatelook" ).value);
    localStorage.setItem( "nameversion", document.getElementById( "nameversion" ).value);
    localStorage.setItem( "nameautorenname", document.getElementById( "nameautorenname" ).value);
    localStorage.setItem( "nameendung", document.getElementById( "nameendung" ).value);
    
    //norm
    
    if( parseBool( localStorage.getItem( "usestopwlist" )) != document.getElementById( "usestopwlist").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1; }
        localStorage.setItem( "usestopwlist", document.getElementById("usestopwlist").checked); 
    }
    if( parseBool( localStorage.getItem( "useinvstopwlist" )) != document.getElementById( "useinvstopwlist").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1; }
        localStorage.setItem( "useinvstopwlist", document.getElementById("useinvstopwlist").checked); 
    }
    if( localStorage.getItem( "normalformsel" ) != document.getElementById( "normalformsel").value ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1; }
        localStorage.setItem( "normalformsel", document.getElementById("normalformsel").value); //values 0,1,.. 
    }
    if( parseBool(localStorage.getItem( "disambidiak" )) != document.getElementById( "disambidiak").checked ){
        if( lastchangeokk  ){ lastchangeokk = 1; }
        localStorage.setItem( "disambidiak", document.getElementById("disambidiak").checked);
    }
    if( parseBool(localStorage.getItem( "disambidashes" )) != document.getElementById( "disambidashes").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "disambidashes", document.getElementById("disambidashes").checked);
    }
    if( parseBool(localStorage.getItem( "uv" )) != document.getElementById( "uv" ).checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "uv", document.getElementById("uv").checked);
    }
    if( parseBool(localStorage.getItem( "ji" )) != document.getElementById( "ji").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "ji", document.getElementById("ji").checked);
    }
    if( parseBool(localStorage.getItem( "womarkup" )) != document.getElementById( "womarkup").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "womarkup", document.getElementById("womarkup").checked);
    }
    if( parseBool(localStorage.getItem( "delpunktu" )) != document.getElementById( "delpunktu").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "delpunktu", document.getElementById("delpunktu").checked);
    }
    if( parseBool(localStorage.getItem( "delnewl" )) != document.getElementById( "delnewl").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "delnewl", document.getElementById("delnewl").checked);
    }
    if( parseBool(localStorage.getItem( "elisions" )) != document.getElementById( "elisions").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "elisions", document.getElementById("elisions").checked);
    }
    if( parseBool(localStorage.getItem( "alphapriv" )) != document.getElementById( "alphapriv").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "alphapriv", document.getElementById("alphapriv").checked);
    }
    if( parseBool(localStorage.getItem( "delnumber" )) != document.getElementById( "delnumber").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "delnumber", document.getElementById("delnumber").checked);
    }
    if( parseBool(localStorage.getItem( "hyph" )) != document.getElementById( "hyph").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "hyph", document.getElementById("hyph").checked);
    }
    if( parseBool(localStorage.getItem( "iota" )) != document.getElementById( "iota").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "iota", document.getElementById("iota").checked);
    }
    if( parseBool(localStorage.getItem( "sigma" )) != document.getElementById( "sigma").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "sigma", document.getElementById("sigma").checked);
    }
    if( parseBool(localStorage.getItem( "deldiak" )) != document.getElementById( "deldiak").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "deldiak", document.getElementById("deldiak").checked);
    }
    if( parseBool(localStorage.getItem( "unkown" )) != document.getElementById( "unkown").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "unkown", document.getElementById("unkown").checked);
    }
    if( parseBool(localStorage.getItem( "ligatu" )) != document.getElementById( "ligatu").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "ligatu", document.getElementById("ligatu").checked);
    }
    if( parseBool(localStorage.getItem( "eqcase" )) != document.getElementById( "eqcase").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "eqcase", document.getElementById("eqcase").checked);
    }
    if( parseBool(localStorage.getItem( "delbrackets" )) != document.getElementById( "delbrackets").checked ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "delbrackets", document.getElementById("delbrackets").checked);
    }
    if( localStorage.getItem( "normcombisel" ) != document.getElementById( "normcombisel").value ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "normcombisel", document.getElementById("normcombisel").value); //values 0,1,.. 
    }
    if( localStorage.getItem( "translitsel" ) != document.getElementById( "translitsel").value ){
        if( lastchangeokk > 1 ){ lastchangeokk = 1;}
        localStorage.setItem( "translitsel", document.getElementById("translitsel").value); //values 0,1,.. 
    }
    
    //token
    if( parseBool(localStorage.getItem( "sepdiak" )) != document.getElementById( "sepdiak" ).checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "sepdiak", document.getElementById("sepdiak").checked);
    }
    if( parseBool(localStorage.getItem( "wconsos" )) != document.getElementById( "wconsos" ).checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "wconsos", document.getElementById("wconsos").checked);
    }
    if( parseBool(localStorage.getItem( "wvocal" )) != document.getElementById( "wvocal" ).checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "wvocal", document.getElementById("wvocal").checked);
    }
    if( parseBool(localStorage.getItem( "justklein" )) != document.getElementById( "justklein").checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "justklein", document.getElementById( "justklein" ).checked );
    }
    if( parseBool(localStorage.getItem( "justgrosz" )) != document.getElementById( "justgrosz").checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "justgrosz", document.getElementById("justgrosz").checked);
    }
    if( localStorage.getItem( "gramsel" ) != document.getElementById( "gramsel").value ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "gramsel", document.getElementById("gramsel").value); //value selected 0 1
    }
    if( localStorage.getItem( "nofgram" ) != document.getElementById( "nofgram").value ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "nofgram", document.getElementById("nofgram").value); //String as number
    }
    if( localStorage.getItem( "vocabularsizebpe" ) != document.getElementById( "vocabularsizebpe").value ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "vocabularsizebpe", document.getElementById("vocabularsizebpe").value); //String as number
    }
    if( localStorage.getItem( "gramgapsize" ) != document.getElementById( "gramgapsize").value ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "gramgapsize", document.getElementById("gramgapsize").value); //String as number
    }
    if( localStorage.getItem( "padsel" ) != document.getElementById( "padsel").value ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "padsel", document.getElementById("padsel").value); // value selected 0 1
    }
    if( parseBool(localStorage.getItem( "gramsteptogramsize" )) != document.getElementById( "gramsteptogramsize" ).checked ){
        if( lastchangeokk > 2 ){ lastchangeokk = 2;}
        localStorage.setItem( "gramsteptogramsize", document.getElementById("gramsteptogramsize").checked);
    }
    //localStorage.setItem( "nachbarsch", document.getElementById("nachbarsch").checked);
    
    //counting
    
     if( localStorage.getItem( "userelfreqdo" ) != document.getElementById( "userelfreqdo").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "userelfreqdo", document.getElementById("userelfreqdo").value);
    }
    if( localStorage.getItem( "mfwcullinc" ) != document.getElementById( "mfwcullinc").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "mfwcullinc", document.getElementById("mfwcullinc").value);
    }
    if( localStorage.getItem( "mfwculllistcuttoff" ) != document.getElementById( "mfwculllistcuttoff").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "mfwculllistcuttoff", document.getElementById("mfwculllistcuttoff").value);
    }
    if( localStorage.getItem( "mfwmin" ) != document.getElementById( "mfwmin").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "mfwmin", document.getElementById("mfwmin").value);
    }
    if( localStorage.getItem( "mfwmax" ) != document.getElementById( "mfwmax").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "mfwmax", document.getElementById("mfwmax").value);
    }
    if( localStorage.getItem( "cullingmin" ) != document.getElementById( "cullingmin").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "cullingmin", document.getElementById("cullingmin").value);
    }
    if( localStorage.getItem( "cullingmax" ) != document.getElementById( "cullingmax").value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "cullingmax", document.getElementById("cullingmax").value);
    }
     if( parseBool(localStorage.getItem( "textlennorm" )) != document.getElementById( "textlennorm" ).checked ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "textlennorm", document.getElementById("textlennorm").checked);
    } 
    if( localStorage.getItem( "textlennormsize" ) != document.getElementById( "textlennormsize" ).value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "textlennormsize", document.getElementById("textlennormsize").value );
    }
    if( localStorage.getItem( "textlennormpartscount" ) != document.getElementById( "textlennormpartscount" ).value ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "textlennormpartscount", document.getElementById("textlennormpartscount").value );
    } 
    if( parseBool(localStorage.getItem( "mfwpertext" )) != document.getElementById( "mfwpertext" ).checked ){
        if( lastchangeokk > 3 ){ lastchangeokk = 3;}
        localStorage.setItem( "mfwpertext", document.getElementById("mfwpertext").checked);
    }
    

    //meassure
    if( localStorage.getItem( "measuresel" ) != document.getElementById( "measuresel").value ){
        if( lastchangeokk > 4 ){ lastchangeokk = 4;}
        localStorage.setItem( "measuresel", document.getElementById("measuresel").value);
    }
    if( localStorage.getItem( "measureadd" ) != document.getElementById( "measureadd").value ){
        if( lastchangeokk > 4 ){ lastchangeokk = 4; }
        localStorage.setItem( "measureadd", document.getElementById("measureadd").value);
    }
    
    //cluster
    if( localStorage.getItem( "clustsel" ) != document.getElementById( "clustsel").value ){
        if( lastchangeokk > 5 ){ lastchangeokk = 5; }
        localStorage.setItem( "clustsel", document.getElementById("clustsel").value);
    }
    if( localStorage.getItem( "hierarclustlinkage" ) != document.getElementById( "hierarclustlinkage").value ){
        if( lastchangeokk > 5 ){ lastchangeokk = 5; }
        localStorage.setItem( "hierarclustlinkage", document.getElementById("hierarclustlinkage").value);
    }
    
    if( localStorage.getItem( "clustoffset" ) != document.getElementById( "clustoffset").value ){
        if( lastchangeokk > 5 ){ lastchangeokk = 5; }
        localStorage.setItem( "clustoffset", document.getElementById("clustoffset").value);
    }
    
    if( localStorage.getItem( "clustpicwidth" ) != document.getElementById( "clustpicwidth").value ){
        if( lastchangeokk > 5 ){ lastchangeokk = 5; }
        localStorage.setItem( "clustpicwidth", document.getElementById("clustpicwidth").value);
    }
    
    if( localStorage.getItem( "clustpicheight" ) != document.getElementById( "clustpicheight").value ){
        if( lastchangeokk > 5 ){ lastchangeokk = 5; }
        localStorage.setItem( "clustpicheight", document.getElementById("clustpicheight").value);
    }

    //export
    //console.log(parseBool(localStorage.getItem( "exportconf" )) != document.getElementById( "exportconf").checked, parseBool(localStorage.getItem( "exportconf" )), document.getElementById( "exportconf").checked);
    if( parseBool(localStorage.getItem( "exportconf" )) != document.getElementById( "exportconf").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "exportconf", document.getElementById("exportconf").checked);
    }
    if( parseBool(localStorage.getItem( "exportstopwordfile" )) != document.getElementById( "exportstopwordfile").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "exportstopwordfile", document.getElementById("exportstopwordfile").checked);
    }
    if( parseBool(localStorage.getItem( "expraw" )) != document.getElementById( "expraw").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expraw", document.getElementById("expraw").checked);
    }
    if( parseBool(localStorage.getItem( "expnormed" )) != document.getElementById( "expnormed").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expnormed", document.getElementById("expnormed").checked);
    }
    if( parseBool(localStorage.getItem( "expdecomp" )) != document.getElementById( "expdecomp").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expdecomp", document.getElementById("expdecomp").checked);
    }
    if( parseBool(localStorage.getItem( "expcounted" )) != document.getElementById( "expcounted").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expcounted", document.getElementById("expcounted").checked);
    }
    if( parseBool(localStorage.getItem( "expdistmatrix" )) != document.getElementById( "expdistmatrix").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expdistmatrix", document.getElementById("expdistmatrix").checked);
    }
    if( parseBool(localStorage.getItem( "expclustertext" )) != document.getElementById( "expclustertext").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expclustertext", document.getElementById("expclustertext").checked);
    }
    if( parseBool(localStorage.getItem( "expclustervis" )) != document.getElementById( "expclustervis").checked ){
        if( lastchangeokk > 6 ){ lastchangeokk = 6; }
        localStorage.setItem( "expclustervis", document.getElementById("expclustervis").checked);
    }
    
    //protocol text
    localStorage.setItem( "protokollinput", document.getElementById("protokollinput").value);
    localStorage.setItem( "protokollnorm", document.getElementById("protokollnorm").value);
    localStorage.setItem( "protokolltoken", document.getElementById("protokolltoken").value); 
    localStorage.setItem( "protokollcount", document.getElementById("protokollcount").value);
    localStorage.setItem( "protokollmeasure", document.getElementById("protokollmeasure").value); 
    localStorage.setItem( "protokollclust", document.getElementById("protokollclust").value);
    localStorage.setItem( "protokollexport", document.getElementById("protokollexport").value);
    
    //stylo ah display / interaction config
    //console.log(document.getElementById("styloahdisplengthdisp").checked, document.getElementById("styloahdisplengthdisp").value);
    localStorage.setItem( "styloahdisplengthdisp", document.getElementById("styloahdisplengthdisp").checked);
    
    //this is just internal if something changes in a analysis step
    //console.log(lastchangeokk, lastchangeokk.toString());
    localStorage.setItem( "lastchangeokk", lastchangeokk.toString() );
}

function resetfnames(){
    const theselected = document.getElementById( "selrerunfiles" ).selectedOptions;
    //clear the fnames array
    fnames = [];
    for(let l = 0; l < theselected.length; l += 1 ){
        fnames.push( theselected[l].innerHTML);
    }
    //SAVE TO THE local storage
    localStorage.setItem( "currrfnames", fnames.join(";;;"));
    localStorage.setItem( "lastchangeokk", "1" );//set the lastchange to minimal value and recompute everything
}

function getlastselection(){
    //if( parseBool( localStorage.getItem( "disambidiak") ) ){
        
        document.getElementById("usestopwlist").checked = parseBool(localStorage.getItem( "usestopwlist"));
        document.getElementById("useinvstopwlist").checked = parseBool(localStorage.getItem( "useinvstopwlist"));
        document.getElementById("normalformsel").value = localStorage.getItem( "normalformsel"); //value selected 0 1
        document.getElementById("disambidiak").checked = parseBool(localStorage.getItem( "disambidiak"));
        document.getElementById("disambidashes").checked = parseBool(localStorage.getItem( "disambidashes"));
        document.getElementById("uv").checked = parseBool(localStorage.getItem( "uv"));
        document.getElementById("ji").checked = parseBool(localStorage.getItem( "ji"));
        document.getElementById("womarkup").checked = parseBool(localStorage.getItem( "womarkup"));
        document.getElementById("delpunktu").checked = parseBool(localStorage.getItem( "delpunktu"));
        document.getElementById("delnewl").checked = parseBool(localStorage.getItem( "delnewl"));
        document.getElementById("elisions").checked = parseBool(localStorage.getItem( "elisions"));
        document.getElementById("alphapriv").checked = parseBool(localStorage.getItem( "alphapriv"));
        document.getElementById("delnumber").checked = parseBool(localStorage.getItem( "delnumber"));
        document.getElementById("hyph").checked = parseBool(localStorage.getItem( "hyph"));
        document.getElementById("iota").checked = parseBool(localStorage.getItem( "iota"));
        document.getElementById("sigma").checked = parseBool(localStorage.getItem( "sigma"));
        document.getElementById("deldiak").checked = parseBool(localStorage.getItem( "deldiak"));
        document.getElementById("unkown").checked = parseBool(localStorage.getItem( "unkown"));
        document.getElementById("ligatu").checked = parseBool(localStorage.getItem( "ligatu"));
        document.getElementById("eqcase").checked = parseBool(localStorage.getItem( "eqcase"));
        document.getElementById("delbrackets").checked = parseBool(localStorage.getItem( "delbrackets" ));
        document.getElementById("normcombisel").value = localStorage.getItem( "normcombisel");
        document.getElementById("translitsel").value = localStorage.getItem( "translitsel");
        document.getElementById("sepdiak").checked = parseBool(localStorage.getItem( "sepdiak"));
        document.getElementById("wconsos").checked = parseBool(localStorage.getItem( "wconsos"));
        document.getElementById("wvocal").checked = parseBool(localStorage.getItem( "wvocal"));
        document.getElementById("justklein").checked = parseBool(localStorage.getItem( "justklein"));
        document.getElementById("justgrosz").checked = parseBool(localStorage.getItem( "justgrosz"));
        document.getElementById("gramsel").value = localStorage.getItem( "gramsel"); //value selected 0 1
        document.getElementById("nofgram").value = localStorage.getItem( "nofgram"); //String as number
        document.getElementById("vocabularsizebpe").value = localStorage.getItem( "vocabularsizebpe");
        document.getElementById("gramgapsize").value = localStorage.getItem( "gramgapsize"); //String as number
        document.getElementById("padsel").value = localStorage.getItem( "padsel"); // value selected 0 1
        document.getElementById("gramsteptogramsize").checked = parseBool(localStorage.getItem( "gramsteptogramsize"));
        document.getElementById("userelfreqdo").value = localStorage.getItem( "userelfreqdo");
        document.getElementById("mfwcullinc").value = localStorage.getItem( "mfwcullinc");
        document.getElementById("mfwculllistcuttoff").value = localStorage.getItem( "mfwculllistcuttoff");
        document.getElementById("mfwmin").value = localStorage.getItem( "mfwmin");
        document.getElementById("mfwmax").value = localStorage.getItem( "mfwmax");
        document.getElementById("cullingmin").value = localStorage.getItem( "cullingmin");
        document.getElementById("cullingmax").value = localStorage.getItem( "cullingmax");
        document.getElementById("textlennorm").checked = parseBool(localStorage.getItem( "textlennorm"));
        document.getElementById("textlennormsize").value = localStorage.getItem( "textlennormsize");
        document.getElementById("textlennormpartscount").value = localStorage.getItem( "textlennormpartscount");
        
        document.getElementById("mfwpertext").checked = parseBool(localStorage.getItem( "mfwpertext"));
        
        document.getElementById("measuresel").value = localStorage.getItem( "measuresel");
        document.getElementById("measureadd").value = localStorage.getItem( "measureadd");
        document.getElementById("clustsel").value = localStorage.getItem( "clustsel");
        document.getElementById("hierarclustlinkage").value = localStorage.getItem( "hierarclustlinkage");
        document.getElementById("clustoffset").value = localStorage.getItem( "clustoffset");
        document.getElementById("clustpicwidth").value = localStorage.getItem( "clustpicwidth");
        document.getElementById("clustpicheight").value = localStorage.getItem( "clustpicheight");

        document.getElementById("exportconf").checked = parseBool( localStorage.getItem( "exportconf"));
        document.getElementById("exportstopwordfile").checked = parseBool( localStorage.getItem( "exportstopwordfile"));
        
        document.getElementById("expraw").checked = parseBool(localStorage.getItem("expraw"));
        document.getElementById("expnormed").checked = parseBool(localStorage.getItem("expnormed"));
        document.getElementById("expdecomp").checked = parseBool(localStorage.getItem("expdecomp"));
        document.getElementById("expcounted").checked = parseBool(localStorage.getItem("expcounted"));
        document.getElementById("expdistmatrix").checked = parseBool(localStorage.getItem("expdistmatrix"));
        document.getElementById("expclustertext").checked = parseBool(localStorage.getItem("expclustertext"));
        document.getElementById("expclustervis").checked = parseBool(localStorage.getItem("expclustervis"));
        
        document.getElementById("protokollinput").value = localStorage.getItem( "protokollinput");
        document.getElementById("protokollnorm").value = localStorage.getItem( "protokollinput");
        document.getElementById("protokolltoken").value = localStorage.getItem( "protokollinput"); 
        document.getElementById("protokollcount").value = localStorage.getItem( "protokollinput");
        document.getElementById("protokollmeasure").value = localStorage.getItem( "protokollinput"); 
        document.getElementById("protokollclust").value = localStorage.getItem( "protokollinput");
        document.getElementById("protokollexport").value = localStorage.getItem( "protokollinput");
        
        document.getElementById( "nametypeown" ).value = localStorage.getItem( "nametypeown" );
        document.getElementById( "nametype" ).value = localStorage.getItem( "nametype" );
        document.getElementById( "namesubject" ).value = localStorage.getItem( "namesubject" );
        document.getElementById( "namestateown" ).value = localStorage.getItem( "namestateown" );
        document.getElementById( "namestate" ).value = localStorage.getItem( "namestate" );
        document.getElementById( "nameid" ).value = localStorage.getItem( "nameid" );
        document.getElementById( "namedatelook" ).value = localStorage.getItem( "namedatelook" );
        document.getElementById( "nameversion" ).value = localStorage.getItem( "nameversion");
        document.getElementById( "nameautorenname" ).value = localStorage.getItem( "nameautorenname" );
        document.getElementById( "nameendung" ).value = localStorage.getItem( "nameendung" );
        
        //stylo ah display / interaction config
        document.getElementById( "styloahdisplengthdisp" ).checked = parseBool( localStorage.getItem( "styloahdisplengthdisp" ) );
        
        //internal usage where / if something changed
        //console.log("ReRun value: ", localStorage.getItem( "lastchangeokk" ) );
        lastchangeokk = parseInt( localStorage.getItem( "lastchangeokk" ) );
        if( isNaN( lastchangeokk )){ //shoulkd never, under no cicumetances be NaN
            lastchangeokk = 7;
        }
        console.log("ReRun value: ", lastchangeokk );
        
        //get ALL FILENAMES FROM THE DATABASE and build options
        let dbre = myindexedDB.open( nameofapp, dbversion );
        dbre.onsuccess = function( e ){
            const ddbb = e.target.result;
            const transaction = ddbb.transaction( "RAWDATA", IDBTransaction.READ_ONLY );
   	 	    const objectStore = transaction.objectStore( "RAWDATA" );
            const allkeysreq = objectStore.getAllKeys();
            
            allkeysreq.onsuccess = function(){
                let noneelem = document.createElement( 'option' );
                noneelem.value = "";
                noneelem.innerHTML = "None";
                document.getElementById( "selrerunfiles" ).appendChild( noneelem );
                for(let r = 0; r < allkeysreq.result.length; r += 1 ){
                    let optelm = document.createElement( 'option' );
                    optelm.value = allkeysreq.result[ r ];
                    optelm.innerHTML = allkeysreq.result[ r ];
                    document.getElementById( "selrerunfiles" ).appendChild( optelm );
                }
               console.log(  );
            } 
            dbre = null;
        }
        
    //}
}

function getconficasarray(){
    let  A = [
        document.getElementById("normalformsel").value,
        document.getElementById("disambidiak").checked,
        document.getElementById("disambidashes").checked,
        document.getElementById("uv").checked,
        document.getElementById("ji").checked,
        document.getElementById("womarkup").checked,
        document.getElementById("delpunktu").checked,
        document.getElementById("delnewl").checked,
        document.getElementById("elisions").checked,
        document.getElementById("alphapriv").checked,
        document.getElementById("delnumber").checked,
        document.getElementById("hyph").checked,
        document.getElementById("iota").checked,
        document.getElementById("sigma").checked,
        document.getElementById("deldiak").checked,
        document.getElementById("unkown").checked,
        document.getElementById("ligatu").checked,
        document.getElementById("eqcase").checked,
        document.getElementById("delbrackets").checked,
        document.getElementById("normcombisel").value,
        document.getElementById("translitsel").value,
        document.getElementById("sepdiak").checked,
        document.getElementById("wconsos").checked,
        document.getElementById("wvocal").checked,
        document.getElementById("justklein").checked,
        document.getElementById("justgrosz").checked,
        document.getElementById("gramsel").value,
        document.getElementById("nofgram").value,
        document.getElementById("padsel").value,
        document.getElementById("mfwcullinc").value,
        document.getElementById("mfwculllistcuttoff").value,
        document.getElementById("mfwmin").value,
        document.getElementById("mfwmax").value,
        document.getElementById("cullingmin").value,
        document.getElementById("cullingmax").value,
        document.getElementById("measuresel").value,
        document.getElementById("measureadd").value,
        document.getElementById("clustsel").value,
        document.getElementById("exportconf").checked,
        document.getElementById("expraw").checked,
        document.getElementById("expnormed").checked,
        document.getElementById("expdecomp").checked,
        document.getElementById("expcounted").checked,
        document.getElementById("expdistmatrix").checked,
        document.getElementById("expclustertext").checked,
        document.getElementById("expclustervis").checked,
        document.getElementById("protokollinput").value,
        document.getElementById("protokollnorm").value,
        document.getElementById("protokolltoken").value, 
        document.getElementById("protokollcount").value,
        document.getElementById( "protokollmeasure").value, 
        document.getElementById( "protokollclust").value,
        document.getElementById( "protokollexport").value,
        document.getElementById( "nametypeown" ).value,
        document.getElementById( "nametype" ).value,
        document.getElementById( "namesubject" ).value,
        document.getElementById( "namestateown" ).value,
        document.getElementById( "namestate" ).value,
        document.getElementById( "nameid" ).value,
        document.getElementById( "namedatelook" ).value,
        document.getElementById( "nameversion" ).value,
        document.getElementById( "nameautorenname" ).value,
        document.getElementById( "nameendung" ).value,
        document.getElementById( "styloahdisplengthdisp" ).checked,
        document.getElementById( "exportstopwordfile" ).checked,
        document.getElementById( "usestopwlist" ).checked,
        document.getElementById( "userelfreqdo" ).value,
        document.getElementById( "clustoffset").value,
        document.getElementById( "gramgapsize").value,
        document.getElementById( "hierarclustlinkage").value,
        document.getElementById( "clustpicwidth").value,
        document.getElementById( "clustpicheight").value,
        document.getElementById( "textlennorm" ).checked,
        document.getElementById( "mfwpertext" ).checked,
        document.getElementById( "gramsteptogramsize" ).checked,
        document.getElementById( "useinvstopwlist" ).checked,
        document.getElementById( "textlennormsize").value,
        document.getElementById( "textlennormpartscount").value,
        document.getElementById( "vocabularsizebpe").value
    ];
    return A;
}

function setconfigfromarray( A ){
    document.getElementById("normalformsel").value = A[0]; //value selected 0 1
    document.getElementById("disambidiak").checked = parseBool(A[1]);
    document.getElementById("disambidashes").checked = parseBool(A[2]);
    document.getElementById("uv").checked = parseBool(A[3]);
    document.getElementById("ji").checked = parseBool(A[4]);
    document.getElementById("womarkup").checked = parseBool(A[5]);
    document.getElementById("delpunktu").checked = parseBool(A[6]);
    document.getElementById("delnewl").checked = parseBool(A[7]);
    document.getElementById("elisions").checked = parseBool(A[8]);
    document.getElementById("alphapriv").checked = parseBool(A[9]);
    document.getElementById("delnumber").checked = parseBool(A[10]);
    document.getElementById("hyph").checked = parseBool(A[11]);
    document.getElementById("iota").checked = parseBool(A[12]);
    document.getElementById("sigma").checked = parseBool(A[13]);
    document.getElementById("deldiak").checked = parseBool(A[14]);
    document.getElementById("unkown").checked = parseBool(A[15]);
    document.getElementById("ligatu").checked = parseBool(A[16]);
    document.getElementById("eqcase").checked = parseBool(A[17]);
    document.getElementById("delbrackets").checked = parseBool(A[18]);
    document.getElementById("normcombisel").value = A[19];
    document.getElementById("translitsel").value = A[20];
    document.getElementById("sepdiak").checked = parseBool(A[21]);
    document.getElementById("wconsos").checked = parseBool(A[22]);
    document.getElementById("wvocal").checked = parseBool(A[23]);
    document.getElementById("justklein").checked = parseBool(A[24]);
    document.getElementById("justgrosz").checked = parseBool(A[25]);
    document.getElementById("gramsel").value = A[26]; //value selected 0 1
    document.getElementById("nofgram").value = A[27]; //String as number
    document.getElementById("padsel").value = A[28]; // value selected 0 1
    document.getElementById("mfwcullinc").value = A[29];
    document.getElementById("mfwculllistcuttoff").value = A[30];
    document.getElementById("mfwmin").value = A[31];
    document.getElementById("mfwmax").value = A[32];
    document.getElementById("cullingmin").value = A[33];
    document.getElementById("cullingmax").value = A[34];
    document.getElementById("measuresel").value = A[35];
    document.getElementById("measureadd").value = A[36];
    document.getElementById("clustsel").value = A[37];
    document.getElementById("exportconf").checked = parseBool(A[38]);
    document.getElementById("expraw").checked = parseBool(A[39]);
    document.getElementById("expnormed").checked = parseBool(A[40]);
    document.getElementById("expdecomp").checked = parseBool(A[41]);
    document.getElementById("expcounted").checked = parseBool(A[42]);
    document.getElementById("expdistmatrix").checked = parseBool(A[43]);
    document.getElementById("expclustertext").checked = parseBool(A[44]);
    document.getElementById("expclustervis").checked = parseBool(A[45]);
    document.getElementById("protokollinput").value = A[46];
    document.getElementById("protokollnorm").value = A[47];
    document.getElementById("protokolltoken").value = A[48]; 
    document.getElementById("protokollcount").value = A[49];
    document.getElementById("protokollmeasure").value = A[50]; 
    document.getElementById("protokollclust").value = A[51];
    document.getElementById("protokollexport").value = A[52];
    document.getElementById( "nametypeown" ).value = A[53];
    document.getElementById( "nametype" ).value = A[54];
    document.getElementById( "namesubject" ).value = A[55];
    document.getElementById( "namestateown" ).value = A[56];
    document.getElementById( "namestate" ).value = A[57];
    document.getElementById( "nameid" ).value = A[58];
    document.getElementById( "namedatelook" ).value = A[59];
    document.getElementById( "nameversion" ).value = A[60];
    document.getElementById( "nameautorenname" ).value = A[61];
    document.getElementById( "nameendung" ).value = A[62];
    document.getElementById( "styloahdisplengthdisp" ).checked = parseBool(A[63]);
    document.getElementById( "exportstopwordfile" ).checked = parseBool(A[64]);
    document.getElementById( "usestopwlist" ).checked = parseBool(A[65]);
    document.getElementById( "userelfreqdo" ).value = A[66];
    document.getElementById("clustoffset").value = A[67];
    document.getElementById( "gramgapsize").value = A[68];
    document.getElementById( "hierarclustlinkage").value = A[69];
    document.getElementById("clustpicwidth").value = A[70];
    document.getElementById("clustpicheight").value = A[71];
    document.getElementById( "textlennorm" ).checked = parseBool(A[72]);
    document.getElementById( "mfwpertext" ).checked = parseBool(A[73]);
    document.getElementById( "gramsteptogramsize" ).checked = parseBool(A[74]);
    document.getElementById( "useinvstopwlist" ).checked = parseBool(A[75]);
    document.getElementById( "textlennormsize").value = A[76];
    document.getElementById( "textlennormpartscount").value = A[77];
    document.getElementById( "vocabularsizebpe").value = A[78];
}

/*config file*/
function writeconfigfile( ){
    //this is a

    let stringofconf = "STYLO-ONLINE PROTOCAL & CONFIG\n\n";
    //time
    stringofconf += "Name: "+ document.getElementById( "readynaming" ).value + "\n\n";
    stringofconf += "Date: "+ Date.now( ).toString( ) + "\n\n";
    stringofconf += "INPUT SEC\n"
    stringofconf += "Note: " + document.getElementById( "protokollinput" ).value + "\n\n";
    stringofconf += "NORM SEC\n"
    stringofconf += "Note: " + document.getElementById( "protokollnorm" ).value + "\n\n";
    stringofconf += "+ String-normalform: "; 
    const nfval = document.getElementById("normalformsel").value;
    if( nfval == 0 ){
        stringofconf += "NFKD \n";
    } else if( nfval == 1 ){
        stringofconf += "NFD \n";
    } else if( nfval == 2){
        stringofconf += "NFKC \n";
    } else if( nfval == 3 ){
        stringofconf += "NFC \n";
    }
    
    if(document.getElementById( "usestopwlist" ).checked){
        stringofconf += "+ Stop Words removed \n"; 
    } else {
        stringofconf += "- Stop Words NOT removed \n"; 
    }
    
    if(document.getElementById( "useinvstopwlist" ).checked){
        stringofconf += "+ Stop Word only text \n"; 
    }  

    const combival = document.getElementById("normcombisel").value;
    if( combival == 0 ){ //no norm combi selected than use single steps
        if( document.getElementById("disambidiak").checked ){
            stringofconf += "+ disambiguate (common code point for equal visual forms) some diacritics \n";
        } else {
            stringofconf += "- NOT disambiguate some diacritics \n";
        }
            
        if( document.getElementById("disambidashes").checked ){
            stringofconf += "+ disambiguate some dashes \n";
        } else {
            stringofconf += "- NOT disambiguate some dashes \n";
        }
        
        if( document.getElementById("uv").checked ){
            stringofconf += "+ UV unified \n";
        } else {
            stringofconf += "- NOT UV unified \n";
        }
        if( document.getElementById("ji").checked ){
            stringofconf += "+ JI unified \n";
        } else {
            stringofconf += "- NOT JI unified \n";
        }
        if( document.getElementById("womarkup").checked ){
            stringofconf += "+ markup deleted \n";
        } else {
            stringofconf += "- NOT markup deleted \n";
        }
        if( document.getElementById("delpunktu").checked ){
            stringofconf += "+ deleted punctuation\n";
        } else {
            stringofconf += "- NOT deleted punctuation \n";
        }
        if( document.getElementById("delnewl").checked ){
            stringofconf += "+ newline deleted \n";
        } else {
            stringofconf += "- NOT newline deleted \n";
        }
        if( document.getElementById("elisions").checked ){
            stringofconf += "+ elisions expanded \n";
        } else {
            stringofconf += "- NOT elisions expanded \n";
        }
        if( document.getElementById("alphapriv").checked ){
            stringofconf += "+ cared for alpha privativum \n";
        } else {
            stringofconf += "- NOT cared for alpha privativum \n";
        }
        if( document.getElementById("delnumber").checked  ){
            stringofconf += "+ numbering (i.e. [8]) deleted \n";
        } else {
            stringofconf += "- NOT numbering (i.e. [8]) deleted \n";
        }
        if( document.getElementById("hyph").checked ){
            stringofconf += "+ cared for hyphenation \n";
        } else {
            stringofconf += "- NOT cared for hyphenation \n";
        }
        if( document.getElementById("iota").checked ){
            stringofconf += "+ replaced iota subscriptum with ioita ad scriptum \n";
        } else {
            stringofconf += "- NOT replaced iota subscriptum with ioita ad scriptum \n";
        }
        if( document.getElementById("sigma").checked ){
            stringofconf += "+ replaced tailing sigmna with sigma \n";
        } else {
            stringofconf += "- NOT replaced tailing sigmna with sigma \n";
        }
        if( document.getElementById("deldiak").checked ){
            stringofconf += "+ diacritics deleted \n";
        } else {
            stringofconf += "- NOT diacritics deleted \n";
        }
        if( document.getElementById("unkown").checked ){
            stringofconf += "+ unknown signs deleted \n";
        } else {
            stringofconf += "- NOT unknown signs deleted \n";
        }
        if( document.getElementById("ligatu").checked ){
            stringofconf += "+ replaced ligatures \n";
        } else {
            stringofconf += "- NOT replaced ligatures \n";
        }
        if( document.getElementById("eqcase").checked ){
            stringofconf += "+ equal case (lower) \n";
        } else {
            stringofconf += "- NOT equal case (lower) \n";
        }
        if( document.getElementById("delbrackets").checked ){
            stringofconf += "+ brackets deleted \n";
        } else {
            stringofconf += "- NOT brackets deleted \n";
        }
    } else {
        //put combination in use
        if( combival == 1 ){
            stringofconf += "+ basic norm (basic equalization and hypenation reversal) \n";
        } else if( combival == 2 ){
            stringofconf += "+ all deleted (deletes UV/JI, brackets, sigma, lower, hyphenation, ligatures, punctuation, edition numbering, unknown signs, diakritics)";
        } else if( combival == 3 ){
            stringofconf += "+ combination of steps (diacritics disambiguation, normalization, hyphenation removal, linebreak to space, punctuation separation and bracket removal)"
        } 

    }

    const tanslival = document.getElementById("translitsel").value;
    if( tanslival == 1 ){
        stringofconf += "+ transliterated gr to la \n";
    } else if( tanslival == 2 ){
        stringofconf += "+ transliterated la to gr \n";
    } else {
        stringofconf += "- NOT transliterated \n";
    }
    stringofconf += "DECOMPOSITION SEC\n";
    stringofconf += "Note: " + document.getElementById( "protokolltoken" ).value + "\n\n";
    if( document.getElementById("justklein").checked ){
        stringofconf += "+ just small words in texts \n";
    } 
    if( document.getElementById("justgrosz").checked ){
        stringofconf += "+ just big words in texts \n";
    } 
    if( document.getElementById("sepdiak").checked ){
        stringofconf += "+ diacritics seperated from word \n";
    } 
    if( document.getElementById("wconsos").checked ){
        stringofconf += "+ consonants removed \n";
    } 
    if( document.getElementById("wvocal").checked ){
        stringofconf += "+ vowels removed \n";
    } 
    
    stringofconf += "+ gram level: ";
    const gramselval = document.getElementById("gramsel").value;
    if( gramselval == 1 ){
        stringofconf += "Word level (groups of words) \n";
    } else if( gramselval == 2 ){
        stringofconf += "Sign level of words  \n";
    } else if( gramselval == 3 ){
        stringofconf += "Signs of whole string (inclu. space characters)  \n";
    } else if( gramselval == 4 ){
        stringofconf += "Gapgram of whole string  \n";
    } else if( gramselval == 5 ){
        stringofconf += "Erasegram of whole string  \n";
    } else if( gramselval == 6 ){
        stringofconf += "Pseudo-syllables  \n";
    } else if( gramselval == 7 ){
        stringofconf += "Head-body-Coda I  \n";
    } else if( gramselval == 8 ){
        stringofconf += "All partitions (Head-body-Coda II)  \n";
    } else if( gramselval == 10 ){
        stringofconf += "Byte pair encoding  \n";
    } 
    stringofconf += "Size of Vocabulary (BPE):" + document.getElementById("vocabularsizebpe").value +"\n";
    stringofconf += "Size of GRAM:" + document.getElementById("nofgram").value +"\n";
    stringofconf += "Size of GAP:" + document.getElementById("gramgapsize").value +"\n";
    if( document.getElementById("padsel").value == 1 ){
        stringofconf += "+ padding of letter grams of words \n";
    } 
    if( document.getElementById("gramsteptogramsize").checked  ){
        stringofconf += "+ n-Gram increment set to n-Gram-Size! \n";
    }
    stringofconf += "COUNTING SEC\n";
    stringofconf += "Note: " + document.getElementById( "protokollcount" ).value + "\n\n";
    stringofconf += "Series increment: " + document.getElementById("mfwcullinc").value +"\n";
    stringofconf += "Counting: " + document.getElementById("userelfreqdo").value +"(0:abs, 1:ref, 2:0/1, 3:TF-IDF, 4:TF-IDF/TF-corpus, 5: TF)\n";
    stringofconf += "Maximum length of frequnecy list: " +document.getElementById("mfwculllistcuttoff").value +"\n";
    stringofconf += "From min frequency: " +document.getElementById("mfwmin").value +" to max frequency value"+ document.getElementById("mfwmax").value+"\n";
    stringofconf += "MFW per text: " +document.getElementById("mfwpertext").checked+"\n";
        
    stringofconf += "Culling min: " +document.getElementById("cullingmin").value+"\n";
    stringofconf += "Culling max: " +document.getElementById("cullingmax").value+"\n";
    stringofconf += "Text length normalization: " +document.getElementById("textlennorm").checked+"\n";
    stringofconf += "Given split length: " +document.getElementById("textlennormsize").value+"\n";
    stringofconf += "Given parts count: " +document.getElementById("textlennormpartscount").value+"\n";
    stringofconf += "MEASSURE SEC\n";
    stringofconf += "Note: " + document.getElementById( "protokollmeasure" ).value + "\n\n";
    stringofconf += "Measure: " +document.getElementById("measuresel").value +"\n";
    stringofconf += "Measure additional value: " +document.getElementById("measureadd").value +"\n";
    stringofconf += "CLUSTER SEC\n";
    stringofconf += "Note: " + document.getElementById( "protokollclust" ).value + "\n\n";
    stringofconf += "Cluster analysis / Embedding: " +document.getElementById("clustsel").value +"\n";
    stringofconf += "Hierarchical cluster linkage: " +document.getElementById("hierarclustlinkage").value +"\n";
    stringofconf += "EXPORT SEC\n";
    stringofconf += "Note: " + document.getElementById( "protokollexport" ).value + "\n\n";
    stringofconf += "Export conf file: " +document.getElementById("exportconf").checked +"\n";
    stringofconf += "Export stop word list: " +document.getElementById("exportstopwordfile").checked +"\n";
    stringofconf += "Export raw text files: " +document.getElementById("expraw").checked +"\n";
    stringofconf += "Export normed text files: " +document.getElementById("expnormed").checked +"\n";
    stringofconf += "Export decomposition as text: " +document.getElementById("expdecomp").checked +"\n";
    stringofconf += "Export frequnecy list: " +document.getElementById("expcounted").checked +"\n";
    stringofconf += "Export distance matrix: " +document.getElementById("expdistmatrix").checked +"\n";
    stringofconf += "Export cluster as text: " +document.getElementById("expclustertext").checked +"\n";
    stringofconf += "Export cluster as SVG: " +document.getElementById("expclustervis").checked +"\n";

    //put the machine part
    stringofconf += "\n\n\n\n\n\n\n\n\n\n\n\n\n:::::::::::";
    const ca = getconficasarray();
    stringofconf += ca.join(";;;");
    //console.log(stringofconf);
    //dodownit( stringofconf, "styloahonline.config", "text/txt" );
    setTimeout( function(){ dodownit( stringofconf, "styloahonline.config", "text/txt" ) }, getrandomtimeshundret(len(stringofconf)));
}

function readinconfigurationfile( elm ){
    for( let f = 0; f < elm.files.length; f += 1 ){
        //console.log( elm.files[f].type, elm.files[f].name );
        if(filenotallowed(elm.files[f].name)){
            alert("Can't use file "+ elm.files[f].name +", end of computation." );
            return -1;
        }
        let freader = new FileReader( );
        freader.onload = ( 
            function( theFile ){
                   return function(e) {
                        let rawconfigfiletext = e.target.result;
                        let machinepart = rawconfigfiletext.split( ":::::::::::" )[1];
                        let ca = machinepart.split(";;;");
                        console.log(ca);
                        setconfigfromarray( ca );
                    };
             }   
        )( elm.files[f] );
        freader.readAsText( elm.files[f] );
    }
}

/*serial config generation*/
function genallcmeasure(){
    
    themanydownloadfiles = document.getElementById( "measuresel" ).options.length;
    let oo = []
    for( let i = 0; i < themanydownloadfiles; i += 1 ){
        oo.push(document.getElementById( "measuresel" ).options[i].value);
    }
    for( let i = 0; i < themanydownloadfiles; i += 1 ){
        console.log("Build config file for ", oo[i], " measure.");
        document.getElementById( "measuresel" ).value = oo[i];
        document.getElementById( "namesubject" ).value = oo[i];
        document.getElementById( "nameid" ).value = i;
        buildaname();
        sisa();
        writeconfigfile();
    }
}

function genallctoken(){
    themanydownloadfiles = document.getElementById( "gramsel" ).options.length;
    let oo = []
    for( let i = 1; i < themanydownloadfiles; i += 1 ){ //skip the first - is none
        oo.push(document.getElementById( "gramsel" ).options[i].value);
    }
    themanydownloadfiles = 15; //the gram size (nested for loops)
    for( let i = 1; i < oo.length; i += 1 ){ //skip the first - is none
        
        document.getElementById( "gramsel" ).value = oo[i];
        let s = "";
        if( oo[i] == 1 ){
            s = "Word level";
        } else if( oo[i] == 2 ){
            s = "Sign level of words";
        } else if( oo[i] == 3 ){
            s = "Signs of whole string";
        } else if( oo[i] == 4 ){
            s = "Gapgram";
        } else if( oo[i] == 5 ){
            s = "Erasegram";
        } else if( oo[i] == 6 ){
            s = "Pseudo-syllables";
        } else if( oo[i] == 7 ){
            s = "Head-body-Coda I";
        } else if( oo[i] == 8 ){
            s = "All partitions (Head-body-Coda II)";
        } else if( oo[i] == 10 ){
            s = "Byte pair encoding";
        } 
        console.log("Build config file for " +s+ " token.");
        if( oo[i] < 6 ){
            for( let pp = 0; pp < 4; pp += 1 ){
                document.getElementById( "nofgram" ).value = (pp+1);
                document.getElementById( "gramgapsize" ).value = 1; //that needs to be a series as well???
                document.getElementById( "padsel" ).value = 0; //no padding ???
                document.getElementById( "nameid" ).value = i.toString()+" "+(pp+1).toString();
                document.getElementById( "namesubject" ).value = s;
                
                buildaname();
                sisa();
                writeconfigfile();
            }
        } else {
            document.getElementById( "nameid" ).value = i;
            document.getElementById( "namesubject" ).value = s;
            
            buildaname();
            sisa();
            writeconfigfile();
        }
    }
}

function genallccount(){

    themanydownloadfiles = document.getElementById( "userelfreqdo" ).options.length;
    let oo = []
    for( let i = 0; i < themanydownloadfiles; i += 1 ){
        oo.push(document.getElementById( "userelfreqdo" ).options[i].value);
    }
    
    for( let i = 0; i < themanydownloadfiles; i += 1 ){
        let s = "";
        if(0 == oo[i]){
            s = "abs";
        } else if( 1 == oo[i] ){
            s = "rel";
        } else if( 2 == oo[i] ){
            s = "01";
        } else if( 3 == oo[i] ){
            s= "TF-IDF";
        } else if( 4 == oo[i] ){
            s= "TF-IDF-TF-corpus";
        } else if( 5 == oo[i] ){
            s= "TF";
        }
        console.log("Build config file for "+ s + " counting.");
        document.getElementById( "userelfreqdo" ).value = oo[i];
        document.getElementById( "namesubject" ).value = s;
        document.getElementById( "nameid" ).value = i;
        buildaname();
        sisa();
        writeconfigfile();
    }
}

/*indexeddb for textdata*/        
function createDB( name ){
	//datenbank zur Speicherung der werte auf ode rabrufen
	let dbrequest = myindexedDB.open( name, dbversion );
	
	dbrequest.onupgradeneeded = function( e ){
  		console.log('Datenbank '+name+' angelegt.');
  		let ddbb = e.target.result;
  		console.log(ddbb.objectStoreNames, ddbb.objectStoreNames.contains('RAWDATA'));
  		if(!ddbb.objectStoreNames.contains('RAWDATA')){
    		let store = ddbb.createObjectStore('RAWDATA', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle RAWDATA angelegt.", index );
            store = null;
            index = null;
  		}
        if(!ddbb.objectStoreNames.contains('NORMEDTS')){
    		let store = ddbb.createObjectStore('NORMEDTS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle NORMEDTS angelegt.", index );
            store = null;
            index = null;
  		}
        if(!ddbb.objectStoreNames.contains('DECOMPTS')){
    		let store = ddbb.createObjectStore('DECOMPTS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle DECOMPTS angelegt.", index );
            store = null;
            index = null;
  		}
        if(!ddbb.objectStoreNames.contains('COUNTTS')){
    		let store = ddbb.createObjectStore('COUNTTS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle COUNTTS angelegt.", index );
            store = null;
            index = null;
  		}
  		if(!ddbb.objectStoreNames.contains('PROFILES')){
    		let store = ddbb.createObjectStore('PROFILES', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle PROFILES angelegt.", index );
            store = null;
            index = null;
  		}
        if(!ddbb.objectStoreNames.contains('DISTTS')){
    		let store = ddbb.createObjectStore('DISTTS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle DISTTS angelegt.", index );
            store = null;
            index = null;
  		}
  		 if(!ddbb.objectStoreNames.contains('CLUSTTS')){
    		let store = ddbb.createObjectStore('CLUSTTS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle CLUSTTS angelegt.", index );
            store = null;
            index = null;
  		}
  		if(!ddbb.objectStoreNames.contains('STOPWORDS')){
    		let store = ddbb.createObjectStore('STOPWORDS', {keyPath: 'bname', autoIncrement: true});
			let index = store.createIndex("bnameIndex", "bname", { "unique": true, multiEntry: false });
			console.log( "Tabelle STOPWORDS angelegt.", index );
            store = null;
            index = null;
            //if table needed a build than fill it and set default frontend config
            writeTO( nameofapp, "STOPWORDS", {"data": stopwords, "bname": "stopwords"} ); //try to write
            setconfigfromarray( defaultconf );
  		}
        dbrequest = null;
        ddbb = null;
	};

	dbrequest.onsuccess = function( e ){
		console.log('Datenbank '+name+' geöffnet.');
        dbrequest = null;
	}

	dbrequest.onerror = function( e ){
		console.log('Datenbank '+name+' build FEHLER ' + e);
        dbrequest = null;
	}
}

function writeTO( name, objstname, theobj ){
	const request = myindexedDB.open( name, dbversion );
	request.onsuccess = function(e){
    	let idb = e.target.result;
    	let trans = idb.transaction( objstname, IDBTransaction.READ_WRITE );
    	let store = trans.objectStore( objstname );
 
    	// add
    	let requestAdd = store.put( theobj );
 
    	requestAdd.onsuccess = function(e) {
			console.log("geschrieben ", name, objstname );
            idb = null;
            trans = null;
            store = null;
            requestAdd = null;
    	};
 
    	requestAdd.onfailure = function(e) {
        	console.log("nicht geschrieben ", name, objstname );
            idb = null;
            trans = null;
            store = null;
            requestAdd = null;
    	};
	};
}
let readdbsemaphor = 0;
function readFROM( name, objstname, theindex, toaddto ){ //fname dbname fname
	let request = myindexedDB.open( name, dbversion );
	request.onsuccess = function( e ){
		console.log( "Get from database: ", name, objstname, theindex );
    	let idb = e.target.result;
    	let transaction = idb.transaction( objstname, IDBTransaction.READ_ONLY );
   	 	let objectStore = transaction.objectStore( objstname );
 
		let cursor = IDBKeyRange.only( theindex );
    	objectStore.openCursor( cursor ).onsuccess = function( event ){
        	let cursor = event.target.result;
            request = null;
            objectStore = null;
            transaction = null;
            idb = null;
        	if( cursor ){
            	
            	if( theindex.indexOf( "clusters_" )!= -1 ){ 
				    clusters = cursor.value.data;
				} else if( theindex.indexOf( "distancematrix_") != -1 ){
				    dmts = cursor.value.data;
				} else if( theindex.indexOf( "profiles_" ) != -1 ){ 
				    profiles = cursor.value.data;
				} else {
				    toaddto[theindex] = cursor.value.data;
				}
				readdbsemaphor += 1;
				console.log('Daten vorhanden - nicht rechnen!', readdbsemaphor, (fnames.length*4)+3);//, cursor.value.data );
        	} else {
            	console.log('Keine Daten! Rechnen!');
				
        	}
    	};
	};
	request.onerror = function( e ){
		console.log('Keine Datenbank.');
        request = null;
	};
}

function deleteDB(){
    localStorage.setItem( "rundo", 0);
    localStorage.setItem( "rerundo", 0);
    let delrequest = indexedDB.deleteDatabase( nameofapp );
    delrequest.onblocked = function () {
        console.log("Delete DB blocked.");
    }
    delrequest.onerror = function () {
        console.log("Error deleting the DB");
    };
    delrequest.onsuccess = function () {
        console.log("Deleted OK.");
    };
}

function resetall(){
    deleteDB();
    delconfigofall();
}

/* Ananlysis steps perfoming */
function buildsignhisto( astr ){ //with string
    let histooo = {};
    const signs = astr.split("");
    for( let s = 0; s < signs.length; s += 1 ){
        if( histooo[signs[s]] ){
            histooo[signs[s]] += 1;
        } else {
            histooo[signs[s]] = 1;
        }
    } 
    //console.log(histooo);
    return histooo;
}

function buildsignhistoArrPower( arrin ){ //with array and power distribution
    let histooo = {};
    
    for( let s = 0; s < arrin.length; s += 1 ){
        if( histooo[arrin[s]] ){
            histooo[arrin[s]] += 1;
        } else {
            histooo[arrin[s]] = 1;
        }
    } 
    //console.log(histooo);
    const sortable = Object.fromEntries( //ES 10, maybe not implemented in some browsers
        Object.entries(histooo).sort(([,a],[,b]) => b-a)
    );

    return sortable;
}

function powertoglocke( histo ){ //sorted from big to small histogramm key value
    const l = len( histo );
    let fhalf = [];
    let shalf = [];
    let k = 0; k < l; k += 1
    for( let key in histo ){
        if( k % 2 == 0 ){
            shalf.push( [key, histo[key] ] );
        } else {
            fhalf.push( [key, histo[key] ] );
        }
        k += 1;
    }
    fhalf.reverse( );
    const sortable = Object.fromEntries( fhalf.concat(shalf) ); 
    return sortable;
}

/*application of normalization*/
function applnorm( ainp ){
    let binp = normatext( ainp, analysisNormalform );
    
    if( document.getElementById("usestopwlist").checked ){
        binp = maskwithstopwlist( stopwords, binp );
    } 
    
    if( document.getElementById("useinvstopwlist").checked ){
        binp = maskwithINVstopwlist( stopwords, binp );
    }
    
    //console.log(binp);
    const combival = document.getElementById("normcombisel").value;
    if( combival == 0 ){ //no norm combi selected than use single steps
        if( document.getElementById("disambidiak").checked ){
            binp = disambiguDIAkritika( binp );
        }   
        if( document.getElementById("disambidashes").checked ){
            binp = disambiguadashes( binp );
        } 
        if( document.getElementById("uv").checked ){
            binp = deluv( binp );
        } 
        if( document.getElementById("ji").checked ){
            binp = delji( binp );
        } 
        if( document.getElementById("womarkup").checked ){
            binp = delmakup( binp );
        } 
        if( document.getElementById("delpunktu").checked ){
            binp = delinterp( binp );
        } 
        if( document.getElementById("delnewl").checked ){
            binp = delumbrbine( binp ); //umbrtospace(binp) ???; tab removal
        } 
        if( document.getElementById("elisions").checked ){
            binp = ExpandelisionText( binp ); 
        } 
        if( document.getElementById("alphapriv").checked ){
            binp = normatext( AlphaPrivativumCopulativumText( normatext( binp, "NFC" ) ), "NFKD" );
        } 
        if( document.getElementById("delnumber").checked  ){
            binp = delnumbering( binp );
        } 
        if( document.getElementById("hyph").checked ){
            binp = Trennstricheraus( disambiguadashes( binp ).split( " " ) ).join( " " );
        } 
        if( document.getElementById("iota").checked ){
            binp = iotasubiotoad( binp );
        } 
        if( document.getElementById("sigma").checked ){
            binp = sigmaistgleich( binp );
        } 
        if( document.getElementById("deldiak").checked ){
            binp = deldiak( binp );
        } 
        if( document.getElementById("unkown").checked ){
            binp = delunknown( binp );
        } 
        if( document.getElementById("ligatu").checked ){
            binp = delligaturen( binp );
        }
        if( document.getElementById("eqcase").checked ){
            binp = delgrkl( binp );
        }
        if( document.getElementById("delbrackets").checked ){
            binp = delklammern( binp );
        } 
    } else {
        //put combination in use
        if( combival == 1 ){
            binp = basClean( binp ); 
        } else if( combival == 2 ){
            binp = delall( binp ); 
        } else if( combival == 3 ){
            binp = GRvorbereitungT( binp );
        } 
    }
    const tanslival = document.getElementById("translitsel").value;
    if( tanslival == 1 ){
        binp = TraslitAncientGreekLatin( binp );
    } else if( tanslival == 2 ){
        binp = TranslitLatinGreekLetters( binp );
    } 
    const nfval = document.getElementById("normalformsel").value;
    if( nfval == 0 ){
        binp = normatext( binp, "NFKD" );
    } else if( nfval == 1 ){
        binp = normatext( binp, "NFD" );
    } else if( nfval == 2){
        binp = normatext( binp, "NFKC" );
    } else if( nfval == 3 ){
        binp = normatext( binp, "NFC" );
    }

    //console.log(binp);
    return binp.split( ' ' ).filter(e => e.trim().length).join( ' ' );
}

/*application of decomposition and saveing to file*/
function appldecomp( fn, ainp ){
    let binp = ainp;
    
    let thereturnresult = null;
    //maybe save additional decompositions
    if( document.getElementById("sepdiak").checked ){
        thereturnresult = ExtractDiafromBuchstText( binp );
        //return thereturnresult;
    }
    if( document.getElementById("wconsos").checked  ){
        //console.log("BBBBBBBB", document.getElementById("gramsel").value, "p");
        thereturnresult = ohneKon( binp );
        //return thereturnresult;
    }
    if( document.getElementById("wvocal").checked ){
        //console.log("BBBBBBBB", document.getElementById("gramsel").value, "p");
        thereturnresult = ohnVoka( binp );
        //return thereturnresult;
    }
    if( document.getElementById("justklein").checked  ){
        thereturnresult = justKLEIN( binp.normalize( analysisNormalform ).split( " " ) ); //because that fkt of gram of justklein is implemented in the earasegram section - 
        //return thereturnresult;
    }
    if( document.getElementById("justgrosz").checked  ){
        thereturnresult = justGROSZ( binp.normalize( analysisNormalform ).split( " " ) );
        //return thereturnresult;
    }
    
    let N = parseInt( document.getElementById("nofgram").value );
    let M = parseInt( document.getElementById("gramgapsize").value );
    let O = 1;
    if( document.getElementById("gramsteptogramsize").checked == true ){
        O = N;
    }
    let P = false;
    if( document.getElementById("padsel").value == "1" ){
        P = true;
    }
    let V = 300;
    if( document.getElementById("vocabularsizebpe").value !== "" ){
        V = parseInt( document.getElementById("vocabularsizebpe").value );
    }
    if( document.getElementById("gramsel").value == 1 ){
        if( thereturnresult ){
            if( thereturnresult instanceof Array ){
                return genngram( thereturnresult, N, O );
            } else {
                return genngram( thereturnresult.split( " " ), N, O );
             }
        } else {
            return genngram( binp.split( " " ), N, O );
        }
    } else if( document.getElementById("gramsel").value == 2 ){
        if( thereturnresult ){
            if( thereturnresult instanceof Array ){
                return ngramWords( thereturnresult, N, O, P );
            } else {
                return ngramWords( thereturnresult.split( " " ), N, O, P );
            }
        } else {
            return ngramWords( binp.split( " " ), N, O, P );
        }
    } else if( document.getElementById("gramsel").value == 3 ){
        if( thereturnresult ){
            if( thereturnresult instanceof Array ){
                return ngramWhole( thereturnresult, N, O );
            } else {
                return ngramWhole( thereturnresult.split( " " ), N, O );
            }
        } else {
            return ngramWhole( binp, N, O );
        }
    } else if( document.getElementById("gramsel").value == 4 ){ //gapgram
        if( thereturnresult ){
            if( thereturnresult instanceof Array ){
                return gapgram( thereturnresult, M, N );
            } else {
                return gapgram( thereturnresult.split( " " ), M, N );
            }
        } else {
            return gapgram( binp.split( " " ), M, N );
        }
    } else if( document.getElementById("gramsel").value == 5 ){ //earasegram
    
    } else if( document.getElementById("gramsel").value == 6 ){ //syllabels
        let syllwordarr = silben( binp.normalize( analysisNormalform ) ).map(function(sy){ return sy.trim()} ).join("-");
        let syll = syllwordarr.split("-"); //many "" and " " filter???
        //console.log(syll)
        return syll;
    } else if( document.getElementById("gramsel").value == 7 ){ //kkc
        return toKKC( binp.split( " " ) );
    } else if( document.getElementById("gramsel").value == 8 ){ //kkc2
        const tempresu = toKKCnSufixWords( binp.split( " " ) );
        //console.log(tempresu);
        let flattendresu = [];
        for( let i = 0; i < len( tempresu ); i += 1){
            for( let j = 0; j < len( tempresu[i] ); j += 1 ){
                for( let t = 0; t < len( tempresu[i][j][t]); t += 1 ){
                    if( tempresu[i][j][t].trim() != "" ){
                        flattendresu.push( tempresu[i][j][t] );
                    }
                }
            }
        }
        return flattendresu;
        return tempresu;
    } else if( document.getElementById("gramsel").value == 9 ){ //flatneighbours, not provided now
        return fnb( binp );
    } else if( document.getElementById("gramsel").value == 10 ){ //pyte pair encoding
        if( thereturnresult ){
            //console.log()
            if( thereturnresult instanceof Array ){
                return aplBPE( thereturnresult, V );
            } else {
                return aplBPE( thereturnresult.split( "" ), V );
            }
        } else {
            return aplBPE( binp.split( "" ), V );
        }
    } 
    //console.log("AAAAAAAAAA", thereturnresult);
    if(thereturnresult != null){
        console.log("AAAAAAAAAA");
        //if no gram is seleted, than the return the resutlt from first check button
        if( thereturnresult instanceof Array ){
            return thereturnresult;    
        } else {
            return thereturnresult.split( " " );
        }
    } else {
        //fallback if no decomposition is lected
        return binp.split( " " );
    }
}

function applcounting( alltoken ){
    //console.log( alltoken );
    if( alltoken[0].length == alltoken[1].length && alltoken[0].length == 2 && alltoken[0] instanceof Array){ // that is a byte pair encoding statistics (implementation does implicit counting and no tokenization)
        return alltoken;
    }
    let tokenfreq = {};
    //console.log(alltoken);
    let lenofall = 0;
    for( let tok in alltoken ){
        let t = alltoken[ tok ];
        if( t instanceof Array ){
            t = alltoken[ tok ].join( "" );
        }   
        if( t.trim() != "" ){
            if( tokenfreq[ t ] ){
                tokenfreq[ t ] += 1;
            } else {
                tokenfreq[ t ] = 1;
            }
            lenofall += 1;
        }
    }
    //console.log( lenofall, len(alltoken) );
    //relative frqs
    if( document.getElementById("userelfreqdo").value == 1 ||  document.getElementById("userelfreqdo").value == 3 ||  document.getElementById("userelfreqdo").value == 4 || document.getElementById("userelfreqdo").value == 5 ){ //rel freq and TF-IDF  tf part
        //console.log("rel frequ");
        
        let unterdstrich = lenofall;
        
        if( document.getElementById("userelfreqdo").value == 3 || document.getElementById("userelfreqdo").value == 4 || document.getElementById("userelfreqdo").value == 5){
            unterdstrich = 0;
            for( let t in tokenfreq ){
                if( tokenfreq[ t ] > unterdstrich ){
                    unterdstrich = tokenfreq[ t ];
                }
            }
        }
        for( let t in tokenfreq ){
            tokenfreq[ t ] = tokenfreq[ t ]/unterdstrich;
        }
    } //otherwise it is left like it is - i.e. absolute valuation 
    
    
    
    //sort and short
    let freqlist = Object.keys( tokenfreq ).map( function( k ) {
        return [ k, tokenfreq[ k ] ];
    });
    freqlist.sort((a, b) => b[1] - a[1]);
    //short the list according to the max / min given index
    let posminval = parseInt( document.getElementById( "mfwmin" ).value );
    let posmaxval = parseInt( document.getElementById( "mfwmax" ).value );
    if( document.getElementById( "mfwmin" ).value.trim() == "" ){
        posminval = 0;
    }
    if( document.getElementById( "mfwmax" ).value.trim() == "" ){
        posmaxval = 0;
    }
    if( posmaxval == 0 ){
        posmaxval = len( freqlist );
    }
    
    const temreturn = freqlist.slice( posminval, posmaxval )
    if( len( temreturn ) == 0 ){
        return freqlist;
    }
    return temreturn;
}

function buildprofiles( alltexttokenfreq ){
    const howmanytexts = len(alltexttokenfreq);
    let colltok = {};
    let combintokenfreq = {};
    for( let text in alltexttokenfreq ){
        //console.log(text);
        for( let token in alltexttokenfreq[ text ] ){
            const stringoftoken = alltexttokenfreq[ text ][ token ][ 0 ];
            const freqoftoken = alltexttokenfreq[ text ][ token ][ 1 ];
            //console.log(alltexttokenfreq[ text ][token]);
            if( colltok[ stringoftoken ] ){
                colltok[ stringoftoken ] += 1;
                combintokenfreq[ stringoftoken ] += freqoftoken;
            } else {
                colltok[ stringoftoken ] = 1;
                combintokenfreq[ stringoftoken ] = freqoftoken;
            }
        } 
    }
    //console.log(combintokenfreq);
    //culling
    let tokenprofile = [];
    //console.log( document.getElementById( "mfwmin" ).value, document.getElementById( "cullingmax" ).value);
    let micu = parseFloat( document.getElementById( "cullingmin" ).value );
    if(document.getElementById( "cullingmin" ).value.trim() == ""){
        micu = 0.0;
    }
    if(micu != 0){
        micu = micu/100;
    }
    let macu = parseFloat( document.getElementById( "cullingmax" ).value );
    if(document.getElementById( "cullingmax" ).value.trim() == ""){
        macu = 0.0;
    }
    if( macu != 0){
        macu = macu/100;
    } else {
        macu = 1.0;   
    }
    //MFW if is NOT per text counting
    let freqlist = Object.keys( combintokenfreq ).map( function( k ) {
        return [ k, combintokenfreq[ k ] ];
    });
    freqlist.sort((a, b) => b[1] - a[1]);
    //short the list according to the max / min given index
    let posminval = parseInt( document.getElementById( "mfwmin" ).value );
    let posmaxval = parseInt( document.getElementById( "mfwmax" ).value );
    if( document.getElementById( "mfwmin" ).value.trim() == "" ){
        posminval = 0;
    }
    if( document.getElementById( "mfwmax" ).value.trim() == "" ){
        posmaxval = 0;
    }
    const templen = len( freqlist );
    if( posmaxval == 0 || templen < posmaxval ){
        posmaxval = templen
    }
    let mfwtoken = {};
    for( let i = posminval; i < posmaxval; i += 1 ){
        mfwtoken[ freqlist[i][0] ] = 1;
    }
    //console.log(freqlist, mfwtoken, len(mfwtoken), document.getElementById("mfwpertext").checked);
    //console.log(micu, macu, document.getElementById( "cullingmin" ).value, document.getElementById( "cullingmax" ).value);
    for( let t in colltok ){
        //console.log(t, colltok[t], colltok[t]/howmanytexts);
        const intexts = colltok[t]/howmanytexts;
        if(  intexts >= micu && intexts <= macu ){
            if( !document.getElementById("mfwpertext").checked ){
                if( mfwtoken[t] === 1 ){
                    tokenprofile.push(t);   
                }
            } else {
                tokenprofile.push(t);
            }
        }
    }
    //console.log(tokenprofile);
    //culled list sliced
    let endoflist = parseInt( document.getElementById( "mfwculllistcuttoff" ).value );
    if(document.getElementById( "mfwculllistcuttoff" ).value.trim() == ""){
        endoflist = 0;
    }
    if(endoflist == 0){
        endoflist = len(tokenprofile);
    }
    let finalprofile = tokenprofile.slice(0, endoflist);
    let returnprofiles = {};
    //console.log(len(finalprofile), finalprofile);
    for( let text in alltexttokenfreq ){
        returnprofiles[text] = [[],[]];
        for( let token in finalprofile ){
            let stringoftoken = finalprofile[token];
            
            let tokenindex = findindexoftoken( alltexttokenfreq[ text ], stringoftoken );
            //console.log(stringoftoken, tokenindex);
            returnprofiles[text][0].push( stringoftoken );
            if( tokenindex != -1 ){
                returnprofiles[text][1].push( alltexttokenfreq[ text ][ tokenindex ][ 1 ]  );
            } else {
                returnprofiles[text][1].push( 0.0 );
            }
        }
    }
    if( document.getElementById("userelfreqdo").value == 2 ){ // 0/1 encoding of occurrence
        for( let t in returnprofiles ){
            for( let o = 0; o < returnprofiles[t][0].length; o += 1 ){
                if( returnprofiles[ t ][1][o] != 0){
                    returnprofiles[ t ][1][o] = 1.0;
                }
            }
        }
    } else if( document.getElementById("userelfreqdo").value == 3 ){//TF-IDF
        const howmanydocs = len( returnprofiles );
        let countdocscontainingtoken = {};
        //console.log(finalprofile)
        for( let token in finalprofile ){
            countdocscontainingtoken[ finalprofile[token] ] = 0;
        }
        for( let t in returnprofiles ){
            for( let o = 0; o < returnprofiles[t][0].length; o += 1 ){
                if( returnprofiles[ t ][1][o] != 0 ){
                    countdocscontainingtoken[ returnprofiles[ t ][0][o] ] += 1;
                }
            }
        }
        //console.log(countdocscontainingtoken);
        let idf = {};
        for( let t in countdocscontainingtoken ){
            idf[t] = Math.log10( howmanydocs / countdocscontainingtoken[ t ] ); // 
        }
        //console.log(idf);
        for( let t in returnprofiles ){
            for( let o = 0; o < returnprofiles[t][0].length; o += 1 ){
                returnprofiles[ t ][1][o] = returnprofiles[ t ][1][o] * (idf[ returnprofiles[ t ][0][o] ]); //+1 bei IDF, um die Nullung zu unterdrücken
                
            }
        }
    } else if( document.getElementById("userelfreqdo").value == 4 ){//TF Teilkorpus / TF Ganzkorpus = ungewichtet Wahrscheinlichkeitsverteilung
        
        let countallovertoken = {};
        for( let token in finalprofile ){
            countallovertoken[ finalprofile[token] ] = 0;
        }
        for( let t in returnprofiles ){
            for( let o = 0; o < returnprofiles[t][0].length; o += 1 ){
                if( returnprofiles[ t ][1][o] != 0 ){
                    countallovertoken[ returnprofiles[ t ][0][o] ] += returnprofiles[ t ][1][o];
                }
            }
        }
        //console.log("countallovertoken", countallovertoken, returnprofiles);
        for( let t in returnprofiles ){
            for( let o = 0; o < returnprofiles[t][0].length; o += 1 ){
                returnprofiles[ t ][1][o] = returnprofiles[ t ][1][o] / countallovertoken[ returnprofiles[ t ][0][o] ];
                
            }
        }
    }
    
    //console.log(returnprofiles);
    return returnprofiles;
}

function builddm( ttf ){
    let dm = [];
    const fktname = document.getElementById( "measuresel" ).value;
    const additiontomeasure = parseFloat( document.getElementById( "measureadd" ).value );
    let dmeasure = dmeasuredict[ fktname ];
    
    let justthehauf = [];
    let standardabw = null;
    if(fktname == "burrowsdeltaM" || 
       fktname == "argamonlineardeltaM" || 
       fktname == "edersdeltaM" ||
       fktname == "argamonsquadraticdeltaM"){
       const valuesttf = Object.values(ttf);
       //console.log(valuesttf);
        for( let i = 0; i < len(valuesttf); i += 1 ){
            //console.log(valuesttf[i][1])
            justthehauf.push(valuesttf[i][1]);
        }
        standardabw = stdabw( justthehauf );
    }
    //console.log(dmeasure);
    for( let te in ttf ){
        let result = [];
        
        //console.log( document.getElementById( "measuresel" ).value );
        for(let tee in ttf ){
            //console.log(te, tee, te != tee);
            if( te != tee ){
                if(fktname == "minkowskiM" || 
                   fktname == "wasserst1dM" ||
                   fktname == "gowerM" ){
                    result.push( dmeasure(ttf[te][1], ttf[tee][1], additiontomeasure) );
                    
                   } else if(
                   fktname == "burrowsdeltaM" ||
                   fktname == "argamonlineardeltaM" || 
                   fktname == "edersdeltaM" ||
                   fktname == "argamonsquadraticdeltaM"){
                    result.push( dmeasure(ttf[te][1], ttf[tee][1], standardabw) );
                   
                   } else {
                    result.push( dmeasure(ttf[te][1], ttf[tee][1]) );
                   }
            } else {
                result.push( 0.0 )
            }
            //console.log(te, tee, te != tee, result, dm);
        }
        
        dm.push( result );
        
    }
    //console.log("...", dm);
    return dm;
}

function clusterthetexts( DM, TS ){
    const selection = parseInt( document.getElementById( "clustsel" ).value );
    const linkage = parseInt( document.getElementById( "hierarclustlinkage" ).value );
    if( selection == 0 || selection == 7 || selection == 8 ){ //hierachical clustering
        return clusthierarch( DM, TS, linkage );
    } else if( selection == 1 ){ //MDS Eigenvectors
        return clusthierarch( DM, TS, linkage ); //JUST AS A PLACEHOLDER
    } else if( selection == 2 ){ //MDS angles
        //console.log(DM);
        return MDsomething2D( DM, 2.3 );
    } else if( selection == 3 ){ //PCA cov
        return clusthierarch( DM, TS, linkage ); //JUST AS A PLACEHOLDER
    } else if( selection == 4 ){ //PCA corr 
        return clusthierarch( DM, TS, linkage ); //JUST AS A PLACEHOLDER
    } else if( selection == 5 ){ //tSNE
        return tSNE( 300, 2, 2, 0.5, DM ); //steps to build optimal solution, eff. number of nearest neighbors, target diminsonality, rate, distmatrix
    } else if( selection == 6 ){ //consensus tree
        return clusthierarch( DM, TS, linkage ); //JUST AS A PLACEHOLDER
    } 
}

/* prepare the export */
const neighbours = 3;
function exportdistmaandnodesandedges( DM, TS ){
    let ll = TS.length;
    let tetenodes = "Id;Label;Classes;Group\n";
    for( let a = 0; a < ll; a += 1 ){
        tetenodes +=  a.toString() + ";"+TS[a]+";"+TS[a].slice(0,20)+";"+(a+1).toString()+"\n";
    }
    
    let teteedges = "Source;Target;Weight;Type\n";
    for( let a = 0; a < ll; a += 1 ){
        let zwarr = Array.from( DM[a] );
        let weights = zwarr.sort((a, b) => a - b).slice(0, neighbours);
        let index = [];
        
        for( let w = 0; w < weights.length; w += 1){
            for( let b = 0; b < ll; b += 1 ){
                if( DM[a][b] == weights[w] ){
                    index.push(b);
                    break; //if you have two equal weights this will err the index!!!
                }
            }
        }
        //console.log(index, weights);
        for(let i = 0; i < index.length; i += 1 ){
            teteedges +=  a.toString() + ";" + index[i].toString() + ";"+weights[i].toString()+";undirected\n";
        }
    }
    return [ tetenodes, teteedges ];
}

function prepexpdm( DM, TS ){
    let ll = TS.length;
    let tete = "";
    for( let a = 0; a < ll; a += 1 ){
        tete +=  ";"+TS[a]+"";
    }
    tete +=  "\n";
    for( let a = 0; a < ll; a += 1 ){
        tete +=  TS[a]+";";
        for( let b = 0; b < ll; b += 1 ){
            tete +=  DM[a][b].toString();
            if( b < (ll-1) ){
                tete +=";"
            }
        }
        tete += "\n";
    }
    return tete;
}

function prepexpprof( profs ){
    let str = "";
    for( let pro in profs ){
        str += pro+";;;";
        for( let t = 0; t < profs[pro][0].length; t += 1){
            str += profs[pro][0][t]+";;"+profs[pro][1][t].toString()+"\n";
        }
        str += ";;;;";
    }
    return str;
}

function prepexpcount( countperfi ){
    let str = "";
    for( let tok = 0; tok < countperfi.length; tok += 1 ){
        str += countperfi[ tok ][0] +";;"+countperfi[ tok ][1].toString()+"\n";
    }
    return str;
}


/*GUI FKT*/
//jum menu
window.onscroll = function( e ){
	let themendiv = document.getElementById( "floatmenu" );
	if( themendiv ){
        
        let scroTD = document.body.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
        var scroL = document.body.scrollLeft || window.pageXOffset || document.documentElement.scrollLeft;
        if(scroTD > 200){
            themendiv.style.display = "block";
            themendiv.style.top = scroTD.toString() + "px";
            themendiv.style.left = scroL.toString() + "px";
        } else {
            themendiv.style.display = "none";
        }
	}
};
//naming
function buildaname(){
    let fnameparts = [];
    //Type --
    const a = document.getElementById( "nametypeown" ).value.split(" ").join("-");//value of input
    const b = document.getElementById( "nametype" ).value;//value of select
    const typtyp = ["", "protocol", "draft", "explanation", "experiment"];
    if( a == "" ){
        if( b != 0 ){
            fnameparts.push( typtyp[ b ] );
        }
    } else {
        fnameparts.push( a );
    }
    //Subject --
    const c = document.getElementById( "namesubject" ).value.split(" ").join("-");//value of input text
    if( c != "" ){
        fnameparts.push( c );
    }
    //Status --
    const d = document.getElementById( "namestateown" ).value.split(" ").join("-");//value of text input
    const e = document.getElementById( "namestate" ).value; //value of select
    const statstat = ["", "final", "prefinal", "first-draft", "finished", "unfinished"];
    if( d == "" ){
        if( e != 0 ){
            console.log(statstat[ e ], e);
            fnameparts.push( statstat[ e ] );
        }
    } else {
        fnameparts.push( d );
    }
    //ID --
    const f = document.getElementById( "nameid" ).value.split(" ").join("-");
    if( f != "" ){
        fnameparts.push( f );
    }
    //Date
    let g = document.getElementById( "namedatelook" ).value;
    if( g == "" ){
        const datenew = new Date();
        g = datenew.toISOString().split("T")[0];
        document.getElementById( "namedatelook" ).value = g;
    }
    fnameparts.push( g );
    //Version --
    const h = document.getElementById( "nameversion" ).value.split(" ").join("-");
    if( h != "" ){
        fnameparts.push( h );
    }
    //Authorname --
    const i = document.getElementById( "nameautorenname" ).value.split(" ").join("-");
    if( i != "" ){
        fnameparts.push( i );
    }
    //Endung --
    let j = document.getElementById( "nameendung" ).value;
    if( j == "" ){
        j = "styloahonline";
    }
    console.log(fnameparts);
    let namefinal = delgrkl( fnameparts.join( "_" ) +"."+j );
    document.getElementById( "readynaming" ).value = namefinal;
    
}

/*showing reults of analysisi steps*/
function showallfnames(){
    alert("Used files in DB: \n" +fnames.join(" \n"));
}

function blackoutspanmembers( classid ){
    let al = document.getElementsByClassName( classid );
    for( let em in al ){
        if(al[em] !== undefined && al[em].nodeName == "DIV"){
            al[em].style.color = "black";
        }
    }
}

function showtxofidx( elm ){
    //svg settings
    const scale = 1;//tw/4;//500;
    
    let move = 450;//move the diwgramm y direction
    if( parseInt( document.getElementById( "clustoffset" ).value ) ){
        move = parseInt( document.getElementById( "clustoffset" ).value );
    }
    let tw = len(fnames)*30;
    if(tw < 500){
        tw = 500;
    }
    if( parseInt( document.getElementById( "clustpicwidth" ).value ) > tw ){
        tw = parseInt( document.getElementById( "clustpicwidth" ).value );
    }
    let th = Math.round(tw/2);
    if(th < 500){
        th = 500;
    }
    if( parseInt( document.getElementById( "clustpicheight" ).value ) > th ){
        th = parseInt( document.getElementById( "clustpicheight" ).value );
    }
    const g1 = elm.parentNode.querySelector( "#thehistoraw" );
    if( g1 ){
        g1.remove();
    }
    const svgell = gethistoSVG( tw, th, scale, move, buildsignhisto( rawinp[ elm.name ] ), "" ); 
    svgell.setAttributeNS(null, "id", "thehistoraw");
    elm.parentNode.appendChild( svgell );
    //menutext text result show
    blackoutspanmembers( "r1" );
    
    let lentodisp = len( rawinp[ elm.name ] );
    if( document.getElementById( "styloahdisplengthdisp" ).checked ){ //if checked
        lentodisp = displen;
    }
    //console.log(rawinp, rawinp[ elm.name ], elm.name);
    document.getElementById("zwischenergshow1").innerHTML =  spitzeklammernHTML( rawinp[ elm.name ].slice(0, lentodisp) );
    elm.style.color = "red";
}

function showergofidxnorm( elm ){
    //svg settings
    const scale = 1;//tw/4;//500;
    
    let move = 450;//move the diwgramm y direction
    if( parseInt( document.getElementById( "clustoffset" ).value ) ){
        move = parseInt( document.getElementById( "clustoffset" ).value );
    }
    let tw = len(fnames)*30;
    if(tw < 500){
        tw = 500;
    }
    if( parseInt( document.getElementById( "clustpicwidth" ).value ) > tw ){
        tw = parseInt( document.getElementById( "clustpicwidth" ).value );
    }
    let th = Math.round(tw/2);
    if(th < 500){
        th = 500;
    }
    if( parseInt( document.getElementById( "clustpicheight" ).value ) > th ){
        th = parseInt( document.getElementById( "clustpicheight" ).value );
    }
    const g1 = elm.parentNode.querySelector( "#thehistoraw" );
    if( g1 ){
        g1.remove();
    }
    const svgell = gethistoSVG( tw, th, scale, move, buildsignhisto( normedts[ elm.name ] ), "" ); 
    svgell.setAttributeNS(null, "id", "thehistoraw");
    elm.parentNode.appendChild( svgell );

    blackoutspanmembers( "r2" );
    let lentodisp = len( normedts[ elm.name ] );
    if( document.getElementById( "styloahdisplengthdisp" ).checked ){ //if checked
        lentodisp = displen;
    }
    document.getElementById("zwischenergshow2").innerHTML =  normedts[ elm.name ].slice(0, lentodisp);
    elm.style.color = "red";
}

function showergofidxdecomp( elm ){
    //building a power distribution of token and append this to results html elm
    const scale = 1;//tw/4;//500;
    
    let move = 450;//move the diwgramm y direction
    if( parseInt( document.getElementById( "clustoffset" ).value ) ){
        move = parseInt( document.getElementById( "clustoffset" ).value );
    }
    let tw = len(fnames)*30;
    if(tw < 500){
        tw = 500;
    }
    if( parseInt( document.getElementById( "clustpicwidth" ).value ) > tw ){
        tw = parseInt( document.getElementById( "clustpicwidth" ).value );
    }
    let th = Math.round(tw/2);
    if(th < 500){
        th = 500;
    }
    if( parseInt( document.getElementById( "clustpicheight" ).value ) > th ){
        th = parseInt( document.getElementById( "clustpicheight" ).value );
    }
    const g1 = elm.parentNode.querySelector( "#thehistorawtoken" );
    if( g1 ){
        g1.remove();
    }
    //const svgell = gethistoSVGbare( tw, th, scale, move, powertoglocke( buildsignhistoArrPower( decompts[ elm.name ] )), "" ); 
    const svgell = gethistoSVGbare( tw, th, scale, move, buildsignhistoArrPower( decompts[ elm.name ] ), "" ); 
    svgell.setAttributeNS(null, "id", "thehistorawtoken");
    elm.parentNode.appendChild( svgell );

    blackoutspanmembers( "r3" );
    let lentodisp = len( decompts[ elm.name ] );
    if( document.getElementById( "styloahdisplengthdisp" ).checked ){ //if checked
        lentodisp = displen;
    }
    document.getElementById("zwischenergshow3").innerHTML =  decompts[ elm.name ].slice(0, lentodisp).join("<i style='color:red;'> // </i>");
    elm.style.color = "red";
}

function showergofidxcount( elm ){
    console.log("change count:", elm.name);
    blackoutspanmembers( "r4" );
    let tete = "";
    for( let l = 0; l < profiles[ elm.name ][0].length; l += 1 ){
        tete+= l.toString()+" <i style='color:red'>/"+profiles[ elm.name ][0][l]+"/</i>:"+profiles[ elm.name ][1][l].toString() +"<br>";
    }
    document.getElementById("zwischenergshow4").innerHTML =  tete;
    elm.style.color = "red";
}

function showergofdist( elm ){
    //console.log("--", dmts, elm.innerHTML, profiles);
    const nn = elm.name;
    let i = 0;
    for( let k in profiles ){
        if( k == nn ){
            break;
        }
        i += 1;
    }
    //console.log(nn, i, dmts[ i ], dmts, clusters, profiles);
    blackoutspanmembers( "r5" );
    let tete = nn + " verglichen mit:<br>";
    for( let t = 0; t < dmts[ i ].length; t += 1){
        tete += "<i style='color: gray;'>"+fnames[t]+"</i>: <span style='color:red;'>" +dmts[ i ][t].toString()+" (T1l/T2l = "+len(decompts[ fnames[i] ])/len(decompts[ fnames[t] ])+") </span><br>";
    }
    document.getElementById("zwischenergshow5").innerHTML =  tete;
    elm.style.color = "red";
    
    /*add svg diagrm of distances*/
}

function showergofclust( elm ){
    //should we see the numbers???
    //console.log(dmts, elm.innerHTML, profiles);
   /* const nn = elm.innerHTML;
    let i = 0;
    for( let k in profiles ){
        if( k == nn ){
            break;
        }
        i += 1;
    }
    blackoutspanmembers( "r6" );
    document.getElementById("zwischenergshow6").innerHTML =  nn + ":" + clusters[ i ].join("//");
    elm.style.color = "red";*/
}

function showupallresultsandmenus(){
    //svg settings
    const scale = 1;//tw/4;//500;
    
    let move = 450;//move the diwgramm y direction
    if( parseInt( document.getElementById( "clustoffset" ).value ) ){
        move = parseInt( document.getElementById( "clustoffset" ).value );
    }
    let tw = len(fnames)*30;
    if(tw < 500){
        tw = 500;
    }
    if( parseInt( document.getElementById( "clustpicwidth" ).value ) > tw ){
        tw = parseInt( document.getElementById( "clustpicwidth" ).value );
    }
    let th = Math.round(tw/2);
    if(th < 500){
        th = 500;
    }
    if( parseInt( document.getElementById( "clustpicheight" ).value ) > th ){
        th = parseInt( document.getElementById( "clustpicheight" ).value );
    }
    //
    const elmtoputin = document.getElementById( "resultsofinput" );
    //elmtoputin.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //look for old results and remove them from the html by class name
    let dedadu = true;
    while( dedadu ){
        const les1 = elmtoputin.getElementsByClassName( "r1" ); 
        if( len( les1 ) == 0 ){
            dedadu = false;
            continue;
        }
        for( let i = 0; i < les1.length; i += 1 ){
            les1[ i ].remove( );
            //les1[ i ].parentNode.removeChild( les1[ i ] );
        }
    }
    
    //new results 
    for( let f = 0; f < fnames.length; f+=1 ){
        let aspanelem = document.createElement( 'div' );
        aspanelem.name = fnames[f].toString();
        aspanelem.innerHTML = "<i> "+f.toString()+"</i> " +fnames[f] +" (sign count: <b>"+rawinp[fnames[f]].length+"</b>)";
        aspanelem.className = "clicki r1";
        aspanelem.onclick = function(){ showtxofidx(this); };
        elmtoputin.appendChild( aspanelem );
        if(f == fnames.length-1){
            showtxofidx( aspanelem );
        }
    }
    
    
    const elmtoputin2 = document.getElementById( "resultsofnorm" );
    //elmtoputin2.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //delete old elements if present
    dedadu = true;
    while( dedadu ){
        const les2 = elmtoputin2.getElementsByClassName( "r2" ); 
        if( len( les2 ) == 0 ){
            dedadu = false;
            continue;
        }
        for( let i = 0; i < les2.length; i += 1 ){
            les2[ i ].remove( );
        }
    }
    //new elements
    for( let f = 0; f < fnames.length; f+=1 ){
        let aspanelem = document.createElement( 'div' );
        aspanelem.name = fnames[f].toString();
        aspanelem.innerHTML = "<i> "+f.toString()+"</i> " +fnames[f] +" (sign count: <b>"+normedts[fnames[f]].length+"</b>)";
        aspanelem.className = "clicki r2";
        aspanelem.onclick = function(){ showergofidxnorm(this); };
        elmtoputin2.appendChild( aspanelem );
        if(f == fnames.length-1){
            showergofidxnorm( aspanelem );
        }
        //elmtoputin2.innerHTML += "<i> "+f.toString()+"</i> - <span class='clicki r2' onclick='showergofidxnorm(this)' name='"+fnames[f]+"'>" +fnames[f]+"</span><br> ";
    }
    
    const elmtoputin3 = document.getElementById( "resultsofdecomposition" );
    //elmtoputin3.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //rem existing elemnts of class r3
    dedadu = true;
    while( dedadu ){
        const les3 = elmtoputin3.getElementsByClassName( "r3" ); 
        if( len( les3 ) == 0 ){
            dedadu = false;
            continue;
        }
        for( let i = 0; i < les3.length; i += 1 ){
            les3[ i ].remove( );
        }
    }
    //new r3 elements
    for( let f = 0; f < fnames.length; f+=1 ){
        let aspanelem = document.createElement( 'div' );
        aspanelem.name = fnames[f].toString();
        
        aspanelem.innerHTML = "<i> "+f.toString()+"</i> " +fnames[f] +" (token count: <b>"+decompts[fnames[f]].length+"</b>)";
        aspanelem.className = "clicki r3";
        aspanelem.onclick = function(){ showergofidxdecomp(this); };
        elmtoputin3.appendChild( aspanelem );
        if(f == fnames.length-1){
            showergofidxdecomp( aspanelem );
        }
        //elmtoputin3.innerHTML += "<i> "+f.toString()+"</i> - <span class='clicki r3' onclick='showergofidxdecomp(this)' name='"+fnames[f]+"'>" +fnames[f]+"</span><br> ";
    }
    const elmtoputin4 = document.getElementById( "resultsofcounting" );
    //elmtoputin4.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //remove old r4 elemnts
    dedadu = true;
    while( dedadu ){
        const les4 = elmtoputin4.getElementsByClassName( "r4" ); 
        if( len( les4 ) == 0 ){
            dedadu = false;
            continue;
        }
        for( let i = 0; i < les4.length; i += 1 ){
            les4[ i ].remove( );
        }
    }
    //new r4 elemnts
    for( let f = 0; f < fnames.length; f+=1 ){
        let aspanelem = document.createElement( 'div' );
        aspanelem.onclick = function(){ showergofidxcount(this); };
        aspanelem.name = fnames[f].toString();
        aspanelem.innerHTML = "<i> "+f.toString()+"</i> " +fnames[f];
        aspanelem.className = "clicki r4";
        
        elmtoputin4.appendChild( aspanelem );
        if(f == fnames.length-1){
            showergofidxcount( aspanelem );
        }
        //elmtoputin4.innerHTML += "<i> "+f.toString()+"</i> - <span class='clicki r4' onclick='showergofidxcount(this)' name='"+fnames[f]+"'>" +fnames[f]+"</span><br> ";
    }
    //add the corpus wide count matrix
    //remove existing heatmap svg
    const g7 = elmtoputin4.querySelector( "#thebarplotprofile" );
    if( g7 ){
        g7.remove();
    }
    //heat map dists tw, th, scale, move, dimred1, namearray, linksss
    const thesvgelemP = getbarplot( tw, th, scale, move, profiles, fnames, "" ); 
    thesvgelemP.setAttributeNS(null, "id", "thebarplotprofile");
    elmtoputin4.appendChild( thesvgelemP );
    
    const elmtoputin5 = document.getElementById( "resultsofdist" );
    //elmtoputin5.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //old r5 elemnts delete
    dedadu = true;
    while( dedadu ){
        const les5 = elmtoputin5.getElementsByClassName( "r5" ); 
        if( len( les5 ) == 0 ){
            dedadu = false;
            continue;
        }
        for( let i = 0; i < les5.length; i += 1 ){
            les5[ i ].remove( );
        }
    }
    //new r5 elemnts
    for( let f = 0; f < fnames.length; f+=1 ){
        let aspanelem = document.createElement( 'div' );
        aspanelem.name = fnames[f].toString();
        aspanelem.innerHTML = "<i> "+f.toString()+"</i> " +fnames[f];
        aspanelem.className = "clicki r5";
        aspanelem.onclick = function(){ showergofdist(this); };
        elmtoputin5.appendChild( aspanelem );
        if(f == fnames.length-1){
            showergofdist( aspanelem );
        }
        //elmtoputin5.innerHTML += "<i> "+f.toString()+"</i> - <span class='clicki r5' onclick='showergofdist(this)' name='"+fnames[f]+"'>" +fnames[f]+"</span><br> ";
    }
    
    //remove existing heatmap svg
    const g5 = elmtoputin5.querySelector( "#thedistheat" );
    if( g5 ){
        g5.remove();
    }
    //heat map dists tw, th, scale, move, dimred1, namearray, linksss
    const thesvgelemG = getheatmapsquares( tw, th, scale, move, dmts, fnames, "" ); 
    thesvgelemG.setAttributeNS(null, "id", "thedistheat");
    elmtoputin5.appendChild( thesvgelemG );
    
    
    const elmtoputin6 = document.getElementById( "resultsofclust" );
    //remove existing theclust element
    const g6 = elmtoputin6.querySelector( "#theclust" );
    if( g6 ){
        g6.remove();
    }
    //elmtoputin6.innerHTML += "<br><br><br><b>Files in use: <b><br><br> ";
    //for( let f = 0; f < fnames.length; f+=1 ){
    //    elmtoputin6.innerHTML += "<i> "+f.toString()+"</i> - <span class='clicki r6' onclick='showergofclust(this)' name='"+fnames[f]+"'>" +fnames[f]+"</span><br> ";
    //}
    //resultof cluster draw
    const selection = parseInt( document.getElementById( "clustsel" ).value );
    if( selection == 0 ){ //hierachical clustering - strong hierarchical
        const thesvgelemZ = drawhclust( tw, th, scale, move, clusters, "console.log(this)" ); 
        thesvgelemZ.setAttributeNS(null, "id", "theclust");
        elmtoputin6.appendChild( thesvgelemZ );
        
    } else if( selection == 1 ){ //MDS Eigenvectors
        
    } else if( selection == 2 ){ //MDS angles
        const thesvgelem = drawmdsangsvg( tw, th, scale, move, clusters, fnames, "console.log(this)" );
        thesvgelem.setAttributeNS(null, "id", "theclust");
        elmtoputin6.appendChild( thesvgelem );
    } else if( selection == 3 ){ //PCA cov
        
    } else if( selection == 4 ){ //PCA corr 
        
    } else if( selection == 5 ){ //tSNE
        const thesvgelem = drawtsnesvg( tw, th, scale, move, clusters, fnames, "console.log(this)" );
        thesvgelem.setAttributeNS(null, "id", "theclust");
        elmtoputin6.appendChild( thesvgelem );
    } else if( selection == 6 ){ //consensus tree
        
    } else if( selection == 7 ){ //hierarchical cluster traditional display
        const thesvgelemZ = drawhclustT( tw, th, scale, move, clusters, "console.log(this)" ); 
        thesvgelemZ.setAttributeNS(null, "id", "theclust");
        elmtoputin6.appendChild( thesvgelemZ );
    } else if( selection == 8 ){ //hierarchical cluster AND heat map traditional display
        const thesvgelemZ = drawhclustheat( tw, th, scale, move, clusters, dmts, "console.log(this)" ); 
        thesvgelemZ.setAttributeNS(null, "id", "theclust");
        elmtoputin6.appendChild( thesvgelemZ );
    }
    
}

function showstopwordlist(){
    let string = "";
    for(let w in stopwords){
        string += " "+w;
    }
    alert(string);
}

function readinstopwordlist( elm ){
    for( let f = 0; f < elm.files.length; f += 1 ){
        if( elm.files[f].type.indexOf("text") !== -1 ){
            console.log(f, elm.files[f].type, elm.files[f].name);
            if(filenotallowed(elm.files[f].name)){
                alert("Can't use file "+ elm.files[f].name +", end of computation." );
                return -1;
            }
            let freader = new FileReader( );
            freader.onload = ( 
                function( theFile ){
                   return function(e) {
                        stopwords = buildstopwordlistfromstring( e.target.result );
                        writeTO( nameofapp, "STOPWORDS", {"data": stopwords, "bname": "ownstopwords"} );
                        return 1;
                   };
                }   
            )( elm.files[f] );
            freader.readAsText( elm.files[f] );
        }
    }
}

/******************************main gui fkt************************************/
/*************************RE RUN NO NEW INPUT**********************************/
function oldrun(){
    //old data is already present
    //if change happend get data
    console.log("oldrun", lastchangeokk);
    if( lastchangeokk != 0 ){
        if( lastchangeokk == 1 ){
            console.log("1 redo: norm decomp count dist clust exp");
            for( let f = 0; f < fnames.length; f += 1 ){
                let nameoffile = fnames[ f ];
                normedts[ nameoffile ] = applnorm( rawinp[ nameoffile ] );
                console.log("Done: Text normalization.", nameoffile);
                decompts[ nameoffile ] = appldecomp( nameoffile, normedts[ nameoffile ] ); //no output - that is done by the fkt itself
                console.log("Done: Text decomposition.", nameoffile);
                countsts[ nameoffile ] = applcounting( decompts[ nameoffile ] );
                console.log("Done: Counting.", nameoffile);
                
                //put it to the sql database
                writeTO( nameofapp, "RAWDATA", {"data": rawinp[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Raw input to data base.", nameoffile);
                writeTO( nameofapp, "NORMEDTS", {"data": normedts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Normed input to data base.", nameoffile);
                writeTO( nameofapp, "DECOMPTS", {"data": decompts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Features to data base.", nameoffile);
                writeTO( nameofapp, "COUNTTS", {"data": countsts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Statistics of features to data base.", nameoffile);
                
                //output as files
                if( document.getElementById("expraw").checked ){
                    //dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" );//raw text
                    setTimeout( function(){ dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" ) }, getrandomtimeshundret(len(rawinp[ nameoffile ])));
                    console.log("Exported raw input as: ", nameoffile+"-raw.txt");
                }
                if( document.getElementById("expnormed").checked ){
                    //dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" );//normed
                    setTimeout( function(){ dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" ) }, getrandomtimeshundret(len(normedts[ nameoffile ])));
                    console.log("Exported normed input as: ", nameoffile+"-normed.txt");
                }
                if( document.getElementById("expdecomp").checked ){
                    //dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" );//features
                    setTimeout( function(){ dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" ) }, getrandomtimeshundret(len(decompts[ nameoffile ])));
                    console.log("Exported decomposition as: ", nameoffile+"-decomp.txt");
                }
                if( document.getElementById("expcounted").checked ){//frequencys of all features
                    //dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".csv", "text/txt" );
                    setTimeout( function(){ dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".csv", "text/txt" ) }, getrandomtimeshundret(len(countsts[ nameoffile ])));
                    console.log("Exported statistics (counting) as: ", nameoffile+"_counting__"+document.getElementById("readynaming").value+".csv");
                } 
            }
            //compute the profile of each text and jon them into one matrix, appley the counting rules (i.e. culling)
            profiles = buildprofiles( countsts );
            console.log("Done: Building and filling the profiles of the texts.");
            //wite global profilmatrix
            writeTO( nameofapp, "PROFILES", {"data": profiles, "bname": "profiles_styloahonline"} );
            console.log("Written: Profiles to data base.");
            //compute dietsance matrix
            dmts = builddm( profiles );
            console.log("Done: Compute distance matrix.");
            //write to db
            writeTO( nameofapp, "DISTTS", {"data": dmts, "bname": "distancematrix_styloahonline"} );
            console.log("Written: Distance matrix to data base.");
            //apply the display fkt i.e. the clustering
            clusters = clusterthetexts( dmts,  fnames);
            writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
            console.log("Clusters: ", clusters);
            //export to some files
            if( document.getElementById("expcounted").checked ){//frequencys of all features
                //dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                setTimeout( function(){ dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
                console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
            }
            if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
                //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
                setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
                console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
            }
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        } else if( lastchangeokk == 2 ){
            console.log("2 redo: decomp count dist clust exp", fnames, fnames.length);
            for( let f = 0; f < fnames.length; f += 1 ){
                let nameoffile = fnames[ f ];
                decompts[ nameoffile ] = appldecomp( nameoffile, normedts[ nameoffile ] ); //no output - that is done by the fkt itself
                console.log("Done: Text decomposition.", nameoffile);
                countsts[ nameoffile ] = applcounting( decompts[ nameoffile ] );
                console.log("Done: Counting.", nameoffile);
                
                //put it to the sql database
                writeTO( nameofapp, "NORMEDTS", {"data": normedts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Normed input to data base.", nameoffile);
                writeTO( nameofapp, "DECOMPTS", {"data": decompts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Features to data base.", nameoffile);
                writeTO( nameofapp, "COUNTTS", {"data": countsts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Statistics of features to data base.", nameoffile);
                
                //output as files
                /*if( document.getElementById("expnormed").checked ){
                    //dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" );//normed
                    setTimeout( function(){ dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" ) }, getrandomtimeshundret(len(normedts[ nameoffile ])));
                    console.log("Exported normed input as: ", nameoffile+"-normed.txt");
                }*/
                if( document.getElementById("expdecomp").checked ){
                    //dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" );//features
                    setTimeout( function(){ dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" ) }, getrandomtimeshundret(len(decompts[ nameoffile ])));
                    console.log("Exported decomposition as: ", nameoffile+"-decomp.txt");
                }
                if( document.getElementById("expcounted").checked ){//frequencys of all features
                    //dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                    setTimeout( function(){ dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(countsts[ nameoffile ])));
                    console.log("Exported statistics (counting) as: ", nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt");
                } 
            }
            //compute the profile of each text and jon them into one matrix, appley the counting rules (i.e. culling)
            profiles = buildprofiles( countsts );
            console.log("Done: Building and filling the profiles of the texts.");
            //wite global profilmatrix
            writeTO( nameofapp, "PROFILES", {"data": profiles, "bname": "profiles_styloahonline"} );
            console.log("Written: Profiles to data base.");
            //compute dietsance matrix
            dmts = builddm( profiles );
            console.log("Done: Compute distance matrix.");
            //write to db
            writeTO( nameofapp, "DISTTS", {"data": dmts, "bname": "distancematrix_styloahonline"} );
            console.log("Written: Distance matrix to data base.");
            //apply the display fkt i.e. the clustering
            clusters = clusterthetexts( dmts,  fnames);
            writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
            console.log("Clusters: ", clusters);
            //export to some files
            if( document.getElementById("expcounted").checked ){//frequencys of all features
                //dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                setTimeout( function(){ dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
                console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
            }
            if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
                //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
                setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
                console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
            }
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported clusters NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        } else if( lastchangeokk == 3 ){
            console.log("3 redo: count dist clust exp");
            for( let f = 0; f < fnames.length; f += 1 ){
                let nameoffile = fnames[ f ];
                countsts[ nameoffile ] = applcounting( decompts[ nameoffile ] );
                console.log("Done: Counting.", nameoffile);
                //put it to the indexeddb database
                writeTO( nameofapp, "COUNTTS", {"data": countsts[ nameoffile ], "bname": nameoffile} );
                console.log("Written: Statistics of features to data base.", nameoffile);
                
                //output as files
                if( document.getElementById("expcounted").checked ){//frequencys of all features
                    //dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                    setTimeout( function(){ dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" )  }, getrandomtimeshundret(10));
                    console.log("Exported statistics (counting) as: ", nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt");
                } 
            }
            //compute the profile of each text and jon them into one matrix, appley the counting rules (i.e. culling)
            profiles = buildprofiles( countsts );
            console.log("Done: Building and filling the profiles of the texts.");
            //wite global profilmatrix
            writeTO( nameofapp, "PROFILES", {"data": profiles, "bname": "profiles_styloahonline"} );
            console.log("Written: Profiles to data base.");
            //compute dietsance matrix
            dmts = builddm( profiles );
            console.log("Done: Compute distance matrix.");
            //write to db
            writeTO( nameofapp, "DISTTS", {"data": dmts, "bname": "distancematrix_styloahonline"} );
            console.log("Written: Distance matrix to data base.");
            //apply the display fkt i.e. the clustering
            clusters = clusterthetexts( dmts,  fnames);
            writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
            console.log("Clusters: ", clusters);
            //export to some files
            if( document.getElementById("expcounted").checked ){//frequencys of all features
                //dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                setTimeout( function(){ dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
                console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
            }
            if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
                //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
                setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
                console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
            }
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported clusters NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        } else if( lastchangeokk == 4 ){
            console.log("4 redo: dist clust exp");
            //compute the profile of each text and jon them into one matrix, appley the counting rules (i.e. culling)
            profiles = buildprofiles( countsts );
            console.log("Done: Building and filling the profiles of the texts.");
            //wite global profilmatrix
            writeTO( nameofapp, "PROFILES", {"data": profiles, "bname": "profiles_styloahonline"} );
            console.log("Written: Profiles to data base.");
            //compute dietsance matrix
            dmts = builddm( profiles );
            console.log("Done: Compute distance matrix.");
            //write to db
            writeTO( nameofapp, "DISTTS", {"data": dmts, "bname": "distancematrix_styloahonline"} );
            console.log("Written: Distance matrix to data base.");
            //apply the display fkt i.e. the clustering
            clusters = clusterthetexts( dmts,  fnames);
            writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
            console.log("Clusters: ", clusters);
            //export to some files
            if( document.getElementById("expcounted").checked ){//frequencys of all features
                //dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                setTimeout( function(){ dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
                console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
            }
            if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
                //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
                setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
                console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
            }
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported clusters NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        } else if( lastchangeokk == 5 ){
            console.log("5 redo: clust exp");
            //apply the display fkt i.e. the clustering
            clusters = clusterthetexts( dmts,  fnames);
            writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
            console.log("Clusters: ", clusters);
            //export to some file
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported clusters NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        } else if( lastchangeokk == 6 ){
            console.log("6 redo: exp ...", document.getElementById("expraw").checked);
            
            for( let f = 0; f < fnames.length; f += 1 ){
                //output as files
                let nameoffile = fnames[ f ];
                if( document.getElementById("expraw").checked ){
                    //dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" );//raw text
                    setTimeout( function(){ dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" ) }, getrandomtimeshundret(len(rawinp[ nameoffile ])));
                    console.log("Exported raw input as: ", nameoffile+"-raw.txt");
                }
                if( document.getElementById("expnormed").checked ){
                    //dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" );//normed
                    setTimeout( function(){ dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" ) }, getrandomtimeshundret(len(normedts[ nameoffile ])));
                    console.log("Exported normed input as: ", nameoffile+"-normed.txt");
                }
                if( document.getElementById("expdecomp").checked ){
                    //dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" );//features
                    setTimeout( function(){ dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" ) }, getrandomtimeshundret(len(decompts[ nameoffile ])));
                    console.log("Exported decomposition as: ", nameoffile+"-decomp.txt");
                }
                if( document.getElementById("expcounted").checked ){//frequencys of all features
                    //dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_.txt", "text/txt" );
                    setTimeout( function(){ dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(countsts[ nameoffile ])));
                    console.log("Exported statistics (counting) as: ", nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt");
                } 
            }
            if( document.getElementById("expcounted").checked ){//frequencys of all features
                //dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
                setTimeout( function(){ dodownit( prepexpprof( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
                console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
            }
            if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
                //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
                setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
                console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
            }
            if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
                let erg = exportdistmaandnodesandedges( dmts, fnames );
                //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
                //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
                setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
                console.log("Exported clusters NODES and EDGES files.");
            }
            if( document.getElementById("expclustervis").checked ){//svg cluster down
                 //downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value );
                 setTimeout( function(){ downsvg( document.getElementById( "theclust" ), "clust_"+document.getElementById("readynaming").value ) }, getrandomtimeshundret(10));
                 console.log("Exported CLUSTER SVG.");
            }
        }
    }
    
    //get the specific point in analysis pipeline and reprocess the data from this point on
    //
    showupallresultsandmenus();
    hideloadsign();
    lastchangeokk = 7;
}

let reruninterval = null;
function rerun( ){ //call, when
    if( fnames.length != 0 ){
        localStorage.setItem( "rerundo", 1);
        window.location.reload( );
    }
    showloadsign();
    //get current texts from the database and rerun the analysis
    if(! localStorage.getItem( "currrfnames" )){
        alert("Stylo online had lost track of availabl files, please upload them again.");
        return -1;
    }
    //write the config file
    if( document.getElementById("exportconf").checked ){
        writeconfigfile( );
    }
    //write the stopword file if needed
    if( document.getElementById("exportstopwordfile").checked ){
        //dodownit( Object.keys(stopwords).join("\n"), "stopwords.csv", "text/csv" );
        setTimeout( function(){ dodownit( Object.keys(stopwords).join("\n"), "stopwords.csv", "text/csv" ) }, getrandomtimeshundret(len(stopwords)));
    }
    
    fnames = localStorage.getItem( "currrfnames" ).split(";;;");
    
    //if no change happend - display data, current data on load display
    for( let f = 0; f < fnames.length; f += 1 ){
        let fn = fnames[ f ];
        readFROM( nameofapp, "RAWDATA", fn, rawinp );
        console.log("Read: Raw input from data base.", fn);
        readFROM( nameofapp, "NORMEDTS", fn, normedts );
        console.log("Read: Normed input from data base.", fn);
        readFROM( nameofapp, "DECOMPTS", fn, decompts );
        console.log("Read: Features from data base.", fn);
        readFROM( nameofapp, "COUNTTS", fn, countsts );
        console.log("Read: Statistics of features from data base.", fn);
    }
    readFROM( nameofapp, "PROFILES", "profiles_styloahonline", profiles );
    console.log("Read: Clusters from data base.", "profiles_styloahonline" );
    readFROM( nameofapp, "DISTTS",  "distancematrix_styloahonline", dmts );
    console.log("Read: Clusters from data base.", "distancematrix_styloahonline");
    readFROM( nameofapp, "CLUSTTS", "clusters_styloahonline", clusters );
    console.log("Read: Clusters from data base.", "clusters_styloahonline" );
    
    howmanydownloadfiles();//count output files
    
    //since that database communication is async do a little time step in the fkt call
    reruninterval = setInterval( function(){ if( readdbsemaphor == ((fnames.length*4)+3) ){ clearInterval( reruninterval ); oldrun(); } }, durationbetweenautosave);//is data present     
}

/*************************NEW INPUT********************************************/
function newrun( ){//synchrone called by async file input function
    //when textlength normalization is applied: Do recalculate the rawtext and the names
    if( document.getElementById( "textlennorm" ).checked ){
        let mintextlen = 1000000;
        for( let f = 0; f < fnames.length; f += 1 ){
            const nameoffile = fnames[ f ];
            rawinp[ nameoffile ] = delmakup(rawinp[ nameoffile ]); //DELET MARKUP!!!
            if( rawinp[ nameoffile ].length < mintextlen ){
                //console.log("min len:", nameoffile, rawinp[ nameoffile ].length, rawinp[ nameoffile ]);
                mintextlen = rawinp[ nameoffile ].length; 
            }
        }
        //check if a fixed length is given
        if( document.getElementById( "textlennormsize" ).value !== "" ){
            const tempmintextlen = parseInt( document.getElementById( "textlennormsize" ).value );
            if( mintextlen > tempmintextlen ){
                mintextlen = tempmintextlen; 
            }
        } 
        let takesome = 1000000;
        if( document.getElementById( "textlennormpartscount" ).value !== "" ){
            takesome = parseInt( document.getElementById( "textlennormpartscount" ).value );
        }
        
        let newfnames = [];
        let newraws = {};
        for( let f = 0; f < fnames.length; f += 1 ){
            const nameoffile = fnames[ f ];
            
            let howmuch = Math.floor(rawinp[ nameoffile ].length/mintextlen);//last part is missing!!!
            let inc = 1;
            if( Math.floor( howmuch / takesome ) >= 1 ){
                inc = Math.floor( howmuch / takesome );
                console.log(inc, howmuch, takesome, nameoffile);
            } else {
                if(howmuch > takesome){
                    howmuch = takesome;
                }
            }
            console.log(rawinp[ nameoffile ].length, howmuch);
            for( let t = 0; t < howmuch; t += inc ){
                const newnamepart = nameoffile+"++part"+t.toString();
                console.log(newnamepart);
                newfnames.push(newnamepart);
                let p = t * mintextlen;
                if( p < rawinp[ nameoffile ].length ){
                    let end = p + mintextlen;
                    if( end > rawinp[ nameoffile ].length ){
                    
                        end = rawinp[ nameoffile ].length-1;
                    }
                    newraws[ newnamepart ] = rawinp[ nameoffile ].slice( p, end );
                }
            }
       }
       fnames = newfnames;
       rawinp = newraws;
    }
    //we allready have the rawdata present
    for( let f = 0; f < fnames.length; f += 1 ){
        const nameoffile = fnames[ f ];
        //console.log(nameoffile, applnorm( rawinp[ nameoffile ] ), "-------------",rawinp[ nameoffile ]);
        normedts[ nameoffile ] = applnorm( rawinp[ nameoffile ] );
        console.log("Done: Text normalization.", nameoffile);
        decompts[ nameoffile ] = appldecomp( nameoffile, normedts[ nameoffile ] ); //no output - that is done by the fkt itself
        console.log("Done: Text decomposition.", nameoffile);
        countsts[ nameoffile ] = applcounting( decompts[ nameoffile ] );
        console.log("Done: Counting.", nameoffile);
        
        //put it to the sql database
        writeTO( nameofapp, "RAWDATA", {"data": rawinp[ nameoffile ], "bname": nameoffile} );
        console.log("Written: Raw input to data base.", nameoffile);
        writeTO( nameofapp, "NORMEDTS", {"data": normedts[ nameoffile ], "bname": nameoffile} );
        console.log("Written: Normed input to data base.", nameoffile);
        writeTO( nameofapp, "DECOMPTS", {"data": decompts[ nameoffile ], "bname": nameoffile} );
        console.log("Written: Features to data base.", nameoffile);
        writeTO( nameofapp, "COUNTTS", {"data": countsts[ nameoffile ], "bname": nameoffile} );
        console.log("Written: Statistics of features to data base.", nameoffile);
        
        //output as files
        if( document.getElementById("expraw").checked ){
            //dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" );//raw text
            setTimeout( function(){ dodownit( rawinp[ nameoffile ], nameoffile+"-raw.txt", "text/txt" ) }, getrandomtimeshundret(len(rawinp[ nameoffile ])));
            console.log("Exported raw input as: ", nameoffile+"-raw.txt");
        }
        if( document.getElementById("expnormed").checked ){
            //dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" );//normed
            setTimeout( function(){ dodownit( normedts[ nameoffile ], nameoffile+"-normed.txt", "text/txt" ) }, getrandomtimeshundret(len(normedts[ nameoffile ])));
            console.log("Exported normed input as: ", nameoffile+"-normed.txt");
        }
        if( document.getElementById("expdecomp").checked ){
            //dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" );//features
            setTimeout( function(){ dodownit( decompts[ nameoffile ], nameoffile+"-decomp.txt", "text/txt" ) }, getrandomtimeshundret(len(decompts[ nameoffile ])));
            console.log("Exported decomposition as: ", nameoffile+"-decomp.txt");
        }
        if( document.getElementById("expcounted").checked ){//frequencys of all features
            //dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" );
            setTimeout( function(){ dodownit( prepexpcount( countsts[ nameoffile ] ), nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(countsts[ nameoffile ])));
            console.log("Exported statistics (counting) as: ", nameoffile+"_counting_"+document.getElementById("readynaming").value+".txt");
        } 
    }
    
    //last step add menus do corpus computations
        
    //compute the profile of each text and jon them into one matrix, appley the counting rules (i.e. culling)
    profiles = buildprofiles( countsts );
    console.log("Done: Building and filling the profiles of the texts.");
    //wite global profilmatrix
    writeTO( nameofapp, "PROFILES", {"data": profiles, "bname": "profiles_styloahonline"} );
    console.log("Written: Profiles to data base.");
    //compute dietsance matrix
    dmts = builddm( profiles );
    console.log("Done: Compute distance matrix.");
    //write to db
    writeTO( nameofapp, "DISTTS", {"data": dmts, "bname": "distancematrix_styloahonline"} );
    console.log("Written: Distance matrix to data base.");
    //apply the display fkt i.e. the clustering
    clusters = clusterthetexts( dmts,  fnames);
    writeTO( nameofapp, "CLUSTTS", {"data": clusters, "bname": "clusters_styloahonline"} );
    console.log("Clusters: ", clusters);
    //export to some files
    if( document.getElementById("expcounted").checked ){//frequencys of all features
        //dodownit( prepexpcount( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" );
        setTimeout( function(){ dodownit( prepexpcount( profiles ), "profiles_"+document.getElementById("readynaming").value+".txt", "text/txt" ) }, getrandomtimeshundret(len(profiles)));
        console.log("Exported profiles as: ", "profiles_"+document.getElementById("readynaming").value+".txt");
    }
    if( document.getElementById("expdistmatrix").checked ){//distance matrix - also gephi import
        //dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" );
        setTimeout( function(){ dodownit( prepexpdm( dmts, fnames ), "distancematrix_"+document.getElementById("readynaming").value+".txt", "text/csv" ) }, getrandomtimeshundret(len(dmts)));
        console.log("Exported distance matrix as: ", "distancematrix_"+document.getElementById("readynaming").value+".csv");
    }
    if( document.getElementById("expclustertext").checked ){//cluster - nodes and edges - gephi
        let erg = exportdistmaandnodesandedges( dmts, fnames );
        //dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
        setTimeout( function(){ dodownit( erg[0], "NODES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[0])));
        //dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" );
        setTimeout( function(){ dodownit( erg[1], "EDGES_"+document.getElementById("readynaming").value+".csv", "text/csv" ) }, getrandomtimeshundret(len(erg[1])));
        console.log("Exported clusters NODES and EDGES files.");
    }
    
    console.log("Ende load input ");
    localStorage.setItem( "currrfnames", fnames.join(";;;"));
    //put it as screen menu
    showupallresultsandmenus();
    hideloadsign();
}
let semephor = 0;

function run( elm ){ //call when input is selected
    //console.log(fnames.length);
    //console.log(elm.files);
    if( fnames.length != 0 ){
        //localStorage.setItem( "rundo", 1);
        alert("Please select the files again.");
        window.location.reload( );
    }
    showloadsign();
    
    //write the config file
    if( document.getElementById("exportconf").checked ){
        writeconfigfile( );
    }
    //write the stopword file if needed
    if( document.getElementById("exportstopwordfile").checked ){
        //dodownit( Object.keys(stopwords).join("\n"), "stopwords.csv", "text/csv" );
        setTimeout( function(){ dodownit( Object.keys(stopwords).join("\n"), "stopwords.csv", "text/csv" ) }, getrandomtimeshundret(len(stopwords)));
    }
    
    //run on input
    //dialog saying that the selections will be applied, when files are selected
    alert("The selected configuration from below will be applied and the results will be displayed, if you change the configuration use the rerun button."); //promt or what ak
    
    console.log(elm.files);
    for( let f = 0; f < elm.files.length; f += 1 ){
        if( elm.files[f].type.indexOf("text") !== -1 ){
            console.log(f, elm.files[f].type, elm.files[f].name);
            if(filenotallowed(elm.files[f].name)){
                alert("Can't use file "+ elm.files[f].name + ", end of computation." );
                return -1;
            }
            let freader = new FileReader( );
            freader.onload = ( 
                function( theFile ){
                   return function(e) {
                        let nameoffile = theFile.name;
                        //put it to RAM representation and run the analysis pipeline ANALYSIS PIPELINE
                        console.log( nameoffile );
                        rawinp[ nameoffile ] = e.target.result;
                        console.log("rawinp len ", len(rawinp));
                        semephor+=1; //if we have also other than rawinput files in the selection!!!
                        return 1;
                   };
                }   
            )( elm.files[f] );
            freader.readAsText( elm.files[f] );
        }
    }

    howmanydownloadfiles();//count the outputfiles

    reruninterval = setInterval( function(){ if( semephor == elm.files.length ){ fnames = Object.keys( rawinp ); clearInterval( reruninterval ); newrun(); } }, durationbetweenautosave);
        
}
/* read multiple config files and run multiple analysis versions */
function runmulticonfig(){
    let mc =  localStorage.getItem( "multiconf" ).split("+++++");
    localStorage.setItem("multiconfimax", mc.length );
    let imc =  parseInt(localStorage.getItem( "multiconfindex" ));
    if( mc.length == imc ){
        return -1;
    }
    lastchangeokk = 1; //change to one, so the whole run will reprocess erveything
    fnames = []; //this prevets a reload caused by the rerun fkt
    readdbsemaphor = 0; //reset the count of opend files - to start computation in rerun fkt
    downelmarray = []; //clear this array to have a new download
    //set new configuration
    console.log(imc, mc, mc[imc]);
    let machinepart = mc[imc].split( ":::::::::::" )[1];
    let ca = machinepart.split(";;;");
                        //console.log(ca);
    setconfigfromarray( ca );
    buildaname();
    //set export configuration (count per file, profiles, dm, nodes edges, svg)
    document.getElementById("exportconf").checked = false;
    document.getElementById("exportstopwordfile").checked = false;
    
    document.getElementById("expraw").checked = false;
    document.getElementById("expnormed").checked = false;
    document.getElementById("expdecomp").checked = false;
    document.getElementById("expcounted").checked = true;
    document.getElementById("expdistmatrix").checked = true;
    document.getElementById("expclustertext").checked = true;
    document.getElementById("expclustervis").checked = true;
    //wait 1 sec
    sisa();
    //call rerun
    setTimeout( function(){rerun();}, durationbetweenautosave );
    if(imc < mc.length){
        ////BUT THIS NEED TO BE DONE IN THE LAST DOWNLOAD OF THE RESULTS; VERY BAD VERY SAD
        //localStorage.setItem("multiconfindex", imc+1 );
        //call runmulticonfig
        //runmulticonfig(); 
    }
}
let multiconf = [];
function getmulticonfig( elm ){
    alert("Make shure, that the output folder is the same like the folder of the config files. This programm step will run on the files in the database. For each config file there will be exported files for counting per text, one profile file, one distance matrix file, one nodes file, one edges file and one cluster svg file.");
    //put config files to the storage
     for( let f = 0; f < elm.files.length; f += 1 ){
            if( elm.files[f].name.indexOf(".config") !== -1 ){
                //console.log(f, elm.files[f].type, elm.files[f].name);
                if(filenotallowed(elm.files[f].name)){
                    alert("Can't use file "+ elm.files[f].name + ", end of computation." );
                    return -1;
                }
                let freader = new FileReader( );
                freader.onload = ( 
                    function( theFile ){
                       return function(e) {
                            let nameoffile = theFile.name;
                            console.log(nameoffile);
                            multiconf.push(e.target.result);
                            semephor+=1;
                            return 1;
                       };
                    }   
                )( elm.files[f] );
                freader.readAsText( elm.files[f] );
            }
        }
    //call runmulticonfig
    reruninterval = setInterval( function(){ if( semephor == elm.files.length ){ localStorage.setItem("multiconf", multiconf.join("+++++"));  localStorage.setItem("multiconfindex", 0); console.log("multi conf: ", len(multiconf)); clearInterval( reruninterval );  runmulticonfig();} }, durationbetweenautosave);
}

//eoffoe
