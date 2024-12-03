class MsAssessmentCategory {
  Id?: string;
  VslType?: string;
  Item?: string;
  Interval?: string;
  ShipSection?: string;
  CreatedBy?: string;
  CreatedDate?: Date | null;
  ModifiedBy?: string;
  ModifiedDate?: Date | null;

  constructor(
    Id: string = "",
    VslType: string = "",
    Item: string = "", // Default value
    Interval: string = "",
    ShipSection: string = "",
    CreatedBy: string = "",
    CreatedDate: Date | null = null,
    ModifiedBy: string = "",
    ModifiedDate: Date | null = null
  ) {
    this.Id = Id;
    this.VslType = VslType;
    this.Item = Item;
    this.Interval = Interval;
    this.ShipSection = ShipSection;
    this.CreatedBy = CreatedBy;
    this.CreatedDate = CreatedDate;
    this.ModifiedBy = ModifiedBy;
    this.ModifiedDate = ModifiedDate;
  }
}
