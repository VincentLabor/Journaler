
const timestamp = (schema)=>{

schema.pre('save', function(next){
    let now = Date.now();
    if(!this.createdAt){
        this.createdAt = now
    }
    next();
})

}

module.exports = timestamp