import { Request, Response } from "express";
export const createMeetingRoom = async (req: Request, res: Response) => {
    let request = req.body;
    let newMeetingRoom  = {
        title: request.title,
        description: request.description,
        
    }
}