public with sharing class BoardController {
    @AuraEnabled
    public static Id createBoard(Board__c board, List<Board_Section__c> boardSections){
        try {
            insert board;
            for(Board_Section__c bs: boardSections){
                bs.Board__c = board.Id;
            }
            insert boardSections;
            return board.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Board__c> getBoards(){
        try {
            List<Board__c> boardList = [SELECT Id,Name,Description__c, NoOfSections__c FROM Board__c];
            if(boardList.size()>0){
                return boardList;
            }
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}