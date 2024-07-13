class ApiFeatures {
    constructor(mongooseQuery, queryStr) {
        this.mongooseQuery = mongooseQuery
        this.queryStr = queryStr
    }

    filter() {
        let query = { ...this.queryStr }
        const excludesField = ["page", "sort", "limit", "field", "search"]
        excludesField.forEach((field) => delete query[field])

        //filter with gt gte lte lt
        let queryString = JSON.stringify(query)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let queryObj = JSON.parse(queryString)
        // console.log(queryObj);

        this.mongooseQuery = this.mongooseQuery.find(queryObj)
        return this
    }

    sort() {
        if (this.queryStr.sort) {
            let sort = this.queryStr.sort.split(',').join(' ')
            // let soft = req.query.sort.replace(/\b(,)\b/g, (match) => ` `)
            // console.log(sort);
            this.mongooseQuery = this.mongooseQuery.sort(sort)
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
        }
        return this
    }

    search(modelName) {
        if (this.queryStr.search) {
            let query = {}
            if (modelName == 'product') {
                query.$or = [
                    { title: { $regex: this.queryStr.search, $options: "i" } },
                    { description: { $regex: this.queryStr.search, $options: "i" } }
                ]
            }
            else {
                query = { name: { $regex: this.queryStr.search, $options: "i" } }
            }
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }

    field() {
        if (this.queryStr.field) {
            let field = this.queryStr.field.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(field)

        }
        else {
            this.mongooseQuery = this.mongooseQuery.select("-__v")
        }
        return this
    }

    pagination(docs) {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 5;
        const skip = (page - 1) * limit;
        const endIndex = page * limit

        const pagination = {}
        pagination.currentPage = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(docs / limit)

        if (page < Math.ceil(docs / limit)) {
            pagination.next = page + 1
        }
        if (page > 1) {
            pagination.prev = page - 1
        }

        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        this.paginationResult = pagination
        return this
    }
}

module.exports = ApiFeatures