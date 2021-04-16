const Handlebars = require("handlebars");


export default class BazaarVoice{
    constructor(id){
        this.rnrId = id;
        this.apiVersion = '5.4';
        this.passkey = 'cayvJ62u3ELqBkmuvrVNySlCyYOlhUmHOPSiz375HmRdQ';
        this.limit = 10;
        this.env = 'https://stg.api.bazaarvoice.com/';
        this.reviewsPath = `${this.env}data/reviews.json?apiversion=${this.apiVersion}&passkey=${this.passkey}&ProductId=${this.rnrId}&limit=${this.limit}`;
        this.statisticsPath = `${this.env}data/statistics.json?apiversion=${this.apiVersion}&passkey=${this.passkey}&filter=productId:${this.rnrId}&stats=Reviews`;
    }

    getReviews(){

        var reviewListTemplate = `
            {{#each reviews}}
                <div>
                    <h4>{{Title}}</h4>
                    <p>{{UserNickname}}: {{ReviewText}}</p>
                </div>
            {{/each}}
        `;

        $.ajax({
            url: this.reviewsPath,
            success: function(myReviews){
                console.log(myReviews);
                var renderReviews = Handlebars.compile(reviewListTemplate);
                document.getElementById('bv-reviews__list').innerHTML = renderReviews({
                    reviews: myReviews.Results,
                });
            }
        });
    }

    getStatistics(){
        $.ajax({
            url: this.statisticsPath,
            success: function(myStats){
                var stats = myStats.Results[0].ProductStatistics.ReviewStatistics;
                console.log(stats);
                $(".js-bv-reviews__summary-rating").html(stats.AverageOverallRating);
                $(".js-bv-reviews__summary-stars").html(stats.OverallRatingRange);
                $(".js-bv-reviews__summary-count span").html(stats.TotalReviewCount);
            }
        });
    }

    openRnRModal(){
        //
    }

    validateForm(){
        //
    }

    submitForm(){
        //
    }

    sortBy(type){
        //switchcase for type
        //&sort=Rating:desc
    }

}