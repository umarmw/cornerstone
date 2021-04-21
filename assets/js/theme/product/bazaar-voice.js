import { data } from "jquery";

const Handlebars = require("handlebars");


export default class BazaarVoice{
    constructor(id){
        this.rnrId = id;
        this.apiVersion = '5.4';
        this.passkey = 'cayvJ62u3ELqBkmuvrVNySlCyYOlhUmHOPSiz375HmRdQ';
        this.limit = 5;
        this.offset = 0;
        this.sortBy = "Rating:desc";
        this.env = 'https://stg.api.bazaarvoice.com/';
        this.reviewsPath = `${this.env}data/reviews.json?apiversion=${this.apiVersion}&passkey=${this.passkey}&ProductId=${this.rnrId}&limit=${this.limit}`;
        this.statisticsPath = `${this.env}data/statistics.json?apiversion=${this.apiVersion}&passkey=${this.passkey}&filter=productId:${this.rnrId}&stats=Reviews`;
        this.fullStarURL = "https://cdn11.bigcommerce.com/s-oxj0ibkqbj/product_images/uploaded_images/10.png";
        this.emptyStarURL = "https://cdn11.bigcommerce.com/s-oxj0ibkqbj/product_images/uploaded_images/0.png";
        this.showMore = document.querySelector('.js-bv-view-more');
    }         

    getReviews(){

        var reviewListTemplate = `
                {{#each reviews}}
                <div class="bv-reviews__grid bv-reviews__content" data-index="{{@index}}" >
                        <div class="bv-reviews__content-left">
                            <p class="bv-reviews__title">{{UserNickname}}</p>
                            <p class="bv-reviews__date">{{SubmissionTime}}</p>
                        </div>
                        <div class="bv-reviews__content-right">
                            <div class="bv-reviews__rating-star">
                                <div class="rating">
                                    <div class="rating__container" id="{{Id}}">
                                    </div>
                                </div>
                            </div>
                            <p class="bv-reviews__title">Love it</p>
                            <div class="bv-reviews__text">
                                <div class="bv-reviews__text-input review__text__more-cont">
                                    {{ReviewText}}
                                <span style="display: none;">                                   
                                </span>
                                </div>
                                <p class="btn btn-tertiary review__text__more">Read more</p>
                            </div>
                        </div>
                    </div>
                </div>
                {{/each}}
        `;
        var reviewsUrl = this.reviewsPath +"&Sort="+this.sortBy+"&Offset="+this.showMore.dataset.current;

        $.ajax({
            context: this,
            url: reviewsUrl,
            success: function(myReviews){
                console.log(myReviews);
                var renderReviews = Handlebars.compile(reviewListTemplate); 
                var reviews = myReviews.Results;      
                var self = this;
                reviews.forEach(function (reviewItem){
                    reviewItem.SubmissionTime = self.formatSubmissionDate(reviewItem.SubmissionTime);
                });
                this.displayReviews(reviews, renderReviews);  
            }
        });
        
    }

    getStatistics(){
        $.ajax({
            context: this,
            url: this.statisticsPath,
            success: function(myStats){
                var stats = myStats.Results[0].ProductStatistics.ReviewStatistics;
                this.renderStars(stats.OverallRatingRange, stats.AverageOverallRating, "js-rating-review-overall");
                $(".js-bv-reviews__final-rating").html(stats.AverageOverallRating);
                $(".js-bv-reviews__summary-stars").html(stats.OverallRatingRange);
                $(".js-bv-reviews__user-count span").html(stats.TotalReviewCount); 
                this.handleSortEvent();
                this.showMoreReviews();
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

    displayReviews(reviews, renderReviews){
        var self= this;
        if(this.showMore.dataset.current == 0){
            document.getElementById('js-bv-reviews-list').innerHTML = renderReviews({
                reviews
            });
        }
        else{
            //Append reviews
            document.getElementById('js-bv-reviews-list').insertAdjacentHTML("beforeend", renderReviews({reviews}));
        }
        reviews.forEach(function (reviewItem){
            self.renderStars(reviewItem.RatingRange, reviewItem.Rating, reviewItem.Id);
            self.splitReviewString(reviewItem.ReviewText)
        });
    }

    handleSortEvent(){
        // var highestRadio = document.getElementById("radio-1");
        // var lowestRadio = document.getElementById("radio-2");
        // var recentRadio = document.getElementById("radio-3");
        var radios = document.querySelectorAll(".radio-btn");
        for (var i=0; i<radios.length; i++){
            radios[i].addEventListener('change', e => {
                this.showMore.dataset.current = 0;
                if(radios[0].checked){
                    this.sortBy = "Rating:desc";
                    this.getReviews();      
                }
                else if(radios[1].checked){
                    this.sortBy = "Rating:asc";
                    this.getReviews();
                }
                else if(radios[2].checked){
                    this.sortBy = "SubmissionTime:desc";
                    this.getReviews();
                }
            });
        }   
    }

    formatSubmissionDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth()),
            day = '' + d.getDate(),
            year = d.getFullYear();

        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];

        if (day.length < 2) 
            day = '0' + day;
    
        return monthNames[month]+" "+day+", "+year;
    }

    splitReviewString(){

    }

    renderStars(overallRatingRange, averageOverallRating, elementID){
        // averageOverallRating = 2.6;
        var partialNumber = Math.round((averageOverallRating - Math.floor(averageOverallRating))*10);
        console.log("Partial number: "+partialNumber);
        var emptyStarRating = overallRatingRange - averageOverallRating;
        var count = 0;
        var ratingContainer = document.getElementById(elementID);
        
        var partialStarURL = "https://cdn11.bigcommerce.com/s-oxj0ibkqbj/product_images/uploaded_images/"+partialNumber+".png";
    
        // var starTemplate = `
        //     <svg class="rating__image"><use xlink:href="#icon-chevron-down"/></svg>
        // `;
        // var renderStar = Handlebars.compile(starTemplate);
        // var starNum = {num: 10};

        for (var i=0; i<Math.trunc(averageOverallRating) ;i++){
            var imageTag = document.createElement("img");
            imageTag.className = "rating__image";
            imageTag.setAttribute("src", this.fullStarURL);
            ratingContainer.append(imageTag);
            // ratingContainer.insertAdjacentHTML("beforeend", renderStar(starNum));
            count++;
        }
        if(partialNumber != 0){
            var imageTag2 = document.createElement("img");
            imageTag2.className = "rating__image";
            imageTag2.setAttribute("src", partialStarURL);
            ratingContainer.append(imageTag2);      
            // starNum.num = partialNumber;
            // ratingContainer.insertAdjacentHTML("beforeend", renderStar(starNum));    
            count++;
        }
        if(emptyStarRating >= 1){
            var emptyStarCount = overallRatingRange - count; 
            for(var j=0; j< emptyStarCount; j++){
                var imageTag3 = document.createElement("img");
                imageTag3.className = "rating__image";
                imageTag3.setAttribute("src", this.emptyStarURL);
                ratingContainer.append(imageTag3);
                // starNum.num = 0;
                // ratingContainer.insertAdjacentHTML("beforeend", renderStar(starNum));  
            }
        }
    }


    showMoreReviews(){
        if (this.showMore) {
        this.showMore.addEventListener('click', e => {
            e.preventDefault();
            var offset = parseInt(this.showMore.dataset.current) + 5;
            this.showMore.dataset.current = offset;
            this.getReviews();
        });
        }
    }

}