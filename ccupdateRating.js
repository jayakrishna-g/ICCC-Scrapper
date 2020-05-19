const distributions = require('distributions');
const normal = distributions.Normal(0,1);
const erf = require('compute-erf') ;

let NumCoders = 0;

let ele = {
    Rating : Number,
    Volatility : Number,
    TimesPlayed : Number,
    EPerf : Number,
    APerf : Number,
    RatingWeight : Number,
    VolatilityWeight :Number,
    Cap : Number,
    Rank : Number,
    Handle : String
}

const getAveRating = (Ranklist) => {
    let tot_rating = 0.0;
    for(let i=0;i<NumCoders ;i++)
    {
        tot_rating += Ranklist[i].Rating;
    }
    return tot_rating / NumCoders;
}

const getCF = (AveRating,Ranklist) => {
    let tot_v2 = 0.0;
    let tot_rc = 0.0;
    for(let i=0;i<NumCoders;i++)
    {
        tot_v2 += (Ranklist[i].Volatility * Ranklist[i].Volatility);
        tot_rc += ((Ranklist[i].Rating - AveRating) * (Ranklist[i].Rating - AveRating));
    }
    tot_v2 /= NumCoders;
    tot_rc /= (NumCoders -1);
    return Math.sqrt(tot_v2 + tot_rc);
}

const Eab = (Ratings , a , b) => {
    const r_diff = Ratings[a].Rating - Ratings[b].Rating;
    const denom = Math.sqrt(Rating[a].Volatility*Rating[a].Volatility + Rating[b].Volatility*Rating[b].Volatility);
    const expo = r_diff / denom;
    const odenom = 1 + Math.pow(4,expo);
    return 1/odenom;
}

const getRatingWeight = (TimesPlayed) => {
    const denom = (0.7 * TimesPlayed) + 0.6;
    const num = (0.4 * TimesPlayed) + 0.2;
    return num/denom; 
}

const getVolatilityWeight = (TimesPlayed) => {
    const num = 0.5 * TimesPlayed + 0.8;
    const denom = TimesPlayed + 0.6;
    return num/denom;
}

const getCap = (Rating , TimesPlayed) => {
    let ret = 100;
    ret += (75/ (TimesPlayed+1));
    ret += ((100*500) / (Math.abs(Rating-1500) + 500));
    return ret;
}

const getPerf = (Rank) => {
    const num = log(NumCoders / Rank - 1);
    const denom = log(4);
    return num/denom;
}

const work = (Ranklist) => {
    NumCoders = Ranklist.length;
    const AveRating = getAveRating(Ranklist);
    const CF = getCF(AveRating,Ranklist);
    for(let i=0;i<NumCoders;i++)
    {
        let wp=0;
        const ARank = Ranklist[i].Rank;
        const OldRating = Ranklist[i].Rating;
        for(let j=0;j<NumCoders;j++)
        {
            wp += Eab(Ranklist,i,j);
        }
        const ERank = wp;
        Ranklist[i].EPerf =  getPerf(ERank); 
        Ranklist[i].APref =  getPerf(ARank);
        Ranklist[i].RatingWeight = getRatingWeight(Ranklist[i].TimesPlayed);
        Ranklist[i].VolatilityWeight = getVolatilityWeight(Ranklist[i].TimesPlayed);
        Ranklist[i].Cap = getCap(OldRating,Ranklist[i].TimesPlayed);
    }
    for(let i=0;i<NumCoders;i++)
    {
        const OldRating = Ranklist[i].Rating;
        const OldVolatility = Ranklist[i].Volatility;
        let NewRating = (OldRating + Ranklist[i].Weight * Ranklist[i].PerfAs) / (1 + Ranklist[i].Weight);
        if(Math.abs(OldRating - NewRating) > Ranklist[i].Cap)
        {
            if(OldRating > NewRating)
            NewRating = OldRating - Ranklist[i].Cap;
            else
            NewRating = OldRating + Ranklist[i].Cap;
        }
        let r_diff_2 = (NewRating - OldRating) * (NewRating - OldRating);
        let NewVolatility = (r_diff_2 * r_diff_2) / Ranklist[i].Weight;
        NewVolatility += (OldVolatility*OldVolatility) / (Ranklist[i].Weight + 1); 
        NewVolatility = Math.sqrt(NewVolatility);
        if(Math.abs(OldVolatility - NewVolatility) > Ranklist[i].Cap)
        {
            if(75 > NewVolatility)
            NewVolatility = 75;
            if(NewVolatility > 200);
            NewVolatility = 200;
        }
        Ranklist[i].Rating = Math.ceil(NewRating);
        Ranklist[i].Volatility = Math.ceil(NewVolatility);
        Ranklist[i].TimesPlayed += 1;
    }
}
module.exports.update = (prevRatings , Leaderboard) => {
    NumCoders = Leaderboard.length;
    Ranklist = [];
    prevRatings.forEach(element => {
        ele.Cap = 0.0;
        ele.Rating = element.Rating;
        ele.TimesPlayed = element.TimesPlayed;
        ele.Volatility = element.Volatility;
        ele.RatingWeight = 0.0;
        ele.VolatilityWeight = 0.0;
        ele.EPerf = 0.0;
        ele.APref = 0.0;
        let f_user = Leaderboard.find((value) => {
            return value.Handle == element.Handle;
        });
        ele.Rank = f_user.Rank;
        ele.Handle = f_user.Handle;
        Ranklist.push(JSON.parse(JSON.stringify(ele)));
    });
    work(Ranklist);
    console.log(Ranklist);
    return Ranklist;
}