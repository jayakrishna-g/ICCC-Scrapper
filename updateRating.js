const distributions = require('distributions');
const normal = distributions.Normal(0,1);
const erf = require('compute-erf') ;

let NumCoders = 0;

let ele = {
    Rating : Number,
    Volatility : Number,
    TimesPlayed : Number,
    PerfAs : Number,
    Weight : Number,
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

const WinProbability = (Ratings , comp_coder , cur_coder) => {
    const r_diff = Ratings[comp_coder].Rating - Ratings[cur_coder].Rating;
    const vol = Ratings[comp_coder].Volatility * Ratings[comp_coder].Volatility + Ratings[cur_coder].Volatility * Ratings[cur_coder].Volatility;
    const denom = Math.sqrt(2 * vol);
    return (0.5) * (erf(r_diff/denom) + 1);
}

const getWeight = (TimesPlayed) => {
    let denom = (0.42 / (TimesPlayed + 1)) + 0.18;
    denom = 1 - denom;
    return ((1/denom) - 1); 
}

const getCap = (TimesPlayed) => {
    let denom = TimesPlayed + 2;
    denom = (1500 / denom);
    return 150 + denom;
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
            wp += WinProbability(Ranklist,j,i);
        }
        const ERank = 0.5 + wp;
        const EPerf =  -1 * normal.inv((ERank-0.5) / NumCoders); 
        const APref =  -1 * normal.inv((ARank-0.5) / NumCoders);
        console.log(ERank + " " + EPerf + " " + APref);
        Ranklist[i].PerfAs = OldRating + CF* (APref - EPerf);
        Ranklist[i].Weight = getWeight(Ranklist[i].TimesPlayed);
        Ranklist[i].Cap = getCap(Ranklist[i].TimesPlayed);
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
        let NewVolatility = (r_diff_2) / Ranklist[i].Weight;
        NewVolatility += (OldVolatility*OldVolatility) / (Ranklist[i].Weight + 1); 
        NewVolatility = Math.sqrt(NewVolatility);
        if(Math.abs(OldVolatility - NewVolatility) > Ranklist[i].Cap)
        {
            if(OldVolatility > NewVolatility)
            NewVolatility = OldVolatility - Ranklist[i].Cap;
            else
            NewVolatility = OldVolatility + Ranklist[i].Cap;
        }
        Ranklist[i].Rating = Math.ceil(NewRating);
        Ranklist[i].Volatility = Math.ceil(NewVolatility);
        Ranklist[i].TimesPlayed += 1;
    }
}
module.exports.update = (prevRatings) => {
    Ranklist = [];
    prevRatings.forEach(element => {
        ele.Cap = 0.0;
        ele.PerfAs = 0.0;
        ele.TimesPlayed = element.ContestDetails.length-1;
        ele.Rating = element.ContestDetails[ele.TimesPlayed].Rating;
        ele.Volatility = element.ContestDetails[ele.TimesPlayed].Volatility;
        ele.Weight = 0.0;
        ele.Rank = element.ContestDetails[ele.TimesPlayed].Rank;
        ele.Handle = element.Handle;
        Ranklist.push(JSON.parse(JSON.stringify(ele)));
    });
    // console.log(Ranklist);
    work(Ranklist);
    // console.log(Ranklist);
    return Ranklist;
}