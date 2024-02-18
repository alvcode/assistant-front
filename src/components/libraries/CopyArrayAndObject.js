class CopyArrayAndObject{

    copy(obj){
        return JSON.parse(JSON.stringify(obj));
    }

};

export default CopyArrayAndObject;