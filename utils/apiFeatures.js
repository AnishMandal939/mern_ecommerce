// made for search filter features
class ApiFeatures {
	constructor(query,queryStr){
		this.query = query;
		this.queryStr = queryStr;
	}

	// building search feature
	search(){
		const keyword = this.queryStr.keyword ? {
			// if found
			name:{
				// using mongodb operator 
				$regex:this.queryStr.keyword,
				$options: "i",
			},
		} : {};

		// console.log(keyword);

		this.query = this.query.find({...keyword});
		return this;
	}

	// for filtering
	filter(){
		const queryCopy = {...this.queryStr}
		// console.log(queryCopy);


		// removing some fields for category
		const removeFields = ["keyword","page","limit"];

		removeFields.forEach(key=> delete queryCopy[key]);
		// console.log(queryCopy);

		// price filter -> to be done by range 
		// console.log(queryCopy);

		let queryStr = JSON.stringify(queryCopy);
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
		// price filter

		// this.query = this.query.find(queryCopy);
		this.query = this.query.find(JSON.parse(queryStr));

		// console.log(queryStr);
		return this;

		// also pagination

	}

	// pagination
	pagination(resultPerPage){
		const currentPage = Number(this.queryStr.page) || 1; //50 -10

		const skip = resultPerPage * (currentPage - 1);

		this.query = this.query.limit(resultPerPage).skip(skip);

		return this;
	} 
};

module.exports = ApiFeatures;