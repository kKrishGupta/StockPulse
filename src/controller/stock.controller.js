import { fetchStockData, saveStockData }   from "../services/stock.service";

export const getStockData = async(req ,res) =>{
  
  try{
    const { symbol } = req.params;
    const data = await fetchStockData(symbol);
    const saved = await saveStockData(data);
    res.json({
      success : true,
      data : saved || data // Return saved data if it was new, otherwise return fetched data
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};