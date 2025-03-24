import Hollow_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Circle_Density_1.jsx?react';
import Hollow_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Dot_Density_1.jsx';
import Hollow_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Rhombus_Density_1.jsx';
import Hollow_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Square_Density_1.jsx';
import Hollow_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Star_Density_1.jsx';
import Hollow_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/hollow_shape_family/Hollow_Single_Triangle_Density_1.jsx';
import Diagonal_Left_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Left_Single_Line_Density_1.jsx';
import Diagonal_Right_Single_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Right_Single_Line_Density_1.jsx';
import Diagonal_Woven_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Diagonal_Woven_Line_Density_1.jsx';
import Single_Horizontal_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Horizontal_Line_Density_1.jsx';
import Single_Vertical_Line_Density_1 from '../../Images/assets/accessible_patterns/line_family/Single_Vertical_Line_Density_1.jsx';
import Solid_Single_Circle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Circle_Density_1.jsx';
import Solid_Single_Dot_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Dot_Density_1.jsx';
import Solid_Single_Rhombus_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Rhombus_Density_1.jsx';
import Solid_Single_Square_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Square_Density_1.jsx';
import Solid_Single_Star_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Star_Density_1.jsx';
import Solid_Single_Triangle_Density_1 from '../../Images/assets/accessible_patterns/solid_shape_family/Solid_Single_Triangle_Density_1.jsx';
const patterns = {
    'Diagonal_Right_Single_Line_Density_1.jsx':Diagonal_Right_Single_Line_Density_1,
    'Diagonal_Left_Single_Line_Density_1.jsx':Diagonal_Left_Single_Line_Density_1, 'Diagonal_Left_Single_Line_Density_1.jsx':Diagonal_Left_Single_Line_Density_1,
    'Diagonal_Woven_Line_Density_1.jsx':Diagonal_Woven_Line_Density_1, 'Single_Horizontal_Line_Density_1.jsx':Single_Horizontal_Line_Density_1,
    'Single_Vertical_Line_Density_1.jsx':Single_Vertical_Line_Density_1,'Solid_Single_Circle_Density_1.jsx':Solid_Single_Circle_Density_1,
    'Solid_Single_Dot_Density_1.jsx':Solid_Single_Dot_Density_1,'Solid_Single_Rhombus_Density_1.jsx':Solid_Single_Rhombus_Density_1,
    'Solid_Single_Square_Density_1.jsx':Solid_Single_Square_Density_1,'Solid_Single_Star_Density_1.jsx':Solid_Single_Star_Density_1,
    'Solid_Single_Triangle_Density_1.jsx':Solid_Single_Triangle_Density_1,'Hollow_Single_Circle_Density_1.jsx':Hollow_Single_Circle_Density_1,
    'Hollow_Single_Dot_Density_1.jsx':Hollow_Single_Dot_Density_1,'Hollow_Single_Rhombus_Density_1.jsx':Hollow_Single_Rhombus_Density_1,
    'Hollow_Single_Square_Density_1.jsx':Hollow_Single_Square_Density_1,'Hollow_Single_Star_Density_1.jsx':Hollow_Single_Star_Density_1,
    'Hollow_Single_Triangle_Density_1.jsx':Hollow_Single_Triangle_Density_1
}

const Assemble_Hollow_Single_Circle_Density_1 = (color,width) => {
    let element = <Hollow_Single_Circle_Density_1 style={{width:"100%",height:"100%"}}stroke={color} patternwidth={width}/>
    console.log(element);
    return element;
}
const Assemble_Hollow_Single_Dot_Density_1 = (color,width) => {
    let element = <Hollow_Single_Dot_Density_1 style={{width:"100%",height:"100%"}}stroke={color} patternwidth={width}/>
    return element;
}

const getPattern = (patternFileName, patternColor,totalwidth) => {
    if (!patternColor || !patternFileName){
        console.error("Error getting pattern: missing name or color")
        return;
    }
    console.log("creating"+patternFileName+" with color: " + patternColor +" and width: " + totalwidth)


    if(patternFileName.localeCompare("Hollow_Single_Circle_Density_1")){
        return Assemble_Hollow_Single_Circle_Density_1(patternColor,totalwidth);
    }
    
    

}

export default getPattern;
